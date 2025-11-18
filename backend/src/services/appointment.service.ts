import mongoose from "mongoose";
import Appointment, { AppointmentStatus } from "../models/appointment.model";
import Property from "../models/property.model";
import User from "../models/user.model";
import {
  notifyNewAppointment,
  notifySellerNewAppointment,
  notifyAppointmentCancelled,
  notifyAppointmentStatusToBuyerAndSeller,
  notifyAppointmentCompleted,
} from "../utils/notificationHelper";

interface CreateAppointmentParams {
  propertyId: string;
  buyerId: string;
  time: string | Date;
  note?: string;
  location?: string;
}

interface BuyerAppointmentFilters {
  page?: number;
  limit?: number;
  status?: AppointmentStatus;
  property_id?: string;
}

interface AgentAppointmentFilters {
  page?: number;
  limit?: number;
  status?: AppointmentStatus;
  property_id?: string;
  startDate?: string | Date;
  endDate?: string | Date;
}

function ensureValidObjectId(id: string, message: string) {
  if (!mongoose.isValidObjectId(id)) {
    throw Object.assign(new Error(message), { status: 400 });
  }
}

export const appointmentService = {
  async createAppointment(params: CreateAppointmentParams) {
    const { propertyId, buyerId, time, note, location } = params;

    ensureValidObjectId(propertyId, "Property ID không hợp lệ");
    ensureValidObjectId(buyerId, "Buyer ID không hợp lệ");

    const appointmentTime = new Date(time);
    if (Number.isNaN(appointmentTime.valueOf())) {
      throw Object.assign(new Error("Thời gian không hợp lệ"), { status: 400 });
    }
    if (appointmentTime <= new Date()) {
      throw Object.assign(
        new Error("Thời gian lịch hẹn phải ở tương lai"),
        { status: 400 }
      );
    }

    const property = await Property.findOne({
      _id: propertyId,
      deleted: false,
    })
      .select("title owner_id agent_id status")
      .lean();

    if (!property) {
      throw Object.assign(new Error("Property không tồn tại"), { status: 404 });
    }

    if (!property.agent_id) {
      throw Object.assign(
        new Error("Property chưa được chỉ định agent"),
        { status: 400 }
      );
    }

    const sellerId = property.owner_id?.toString();
    if (!sellerId) {
      throw Object.assign(
        new Error("Không xác định được seller của property"),
        { status: 400 }
      );
    }

    const appointment = await Appointment.create({
      property_id: new mongoose.Types.ObjectId(propertyId),
      buyer_id: new mongoose.Types.ObjectId(buyerId),
      agent_id: property.agent_id,
      seller_id: new mongoose.Types.ObjectId(sellerId),
      time: appointmentTime,
      note,
      location,
      status: "pending",
    });

    const buyer = await User.findById(buyerId).select("fullName").lean();
    const buyerName = buyer?.fullName || "Người mua";
    const propertyTitle =
      (property.title as any)?.vi ||
      (property.title as any)?.en ||
      "Bất động sản";

    try {
      const appointmentId = appointment.id;
      await notifyNewAppointment(
        property.agent_id.toString(),
        buyerName,
        propertyTitle,
        appointmentId
      );

      await notifySellerNewAppointment(
        sellerId,
        buyerName,
        propertyTitle,
        appointmentId
      );
    } catch (error) {
      console.error("Failed to send appointment notifications:", error);
    }

    return appointment.populate([
      { path: "property_id", select: "title images price status address" },
      { path: "agent_id", select: "fullName email phone avatar" },
      { path: "seller_id", select: "fullName email phone avatar" },
    ]);
  },

  async getAppointmentsByBuyer(
    buyerId: string,
    filters: BuyerAppointmentFilters = {}
  ) {
    ensureValidObjectId(buyerId, "Buyer ID không hợp lệ");

    const { page = 1, limit = 10, status, property_id } = filters;
    const pageNum = Number(page) > 0 ? Number(page) : 1;
    const limitNum = Number(limit) > 0 ? Number(limit) : 10;
    const skip = (pageNum - 1) * limitNum;

    const query: Record<string, any> = {
      buyer_id: new mongoose.Types.ObjectId(buyerId),
    };

    if (status) {
      query.status = status;
    }

    if (property_id) {
      ensureValidObjectId(property_id, "Property ID không hợp lệ");
      query.property_id = new mongoose.Types.ObjectId(property_id);
    }

    const [items, total] = await Promise.all([
      Appointment.find(query)
        .sort({ time: 1 })
        .skip(skip)
        .limit(limitNum)
        .populate("property_id", "title images price address status")
        .populate("agent_id", "fullName email phone avatar")
        .populate("seller_id", "fullName email phone avatar")
        .lean(),
      Appointment.countDocuments(query),
    ]);

    return {
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
      data: items,
    };
  },

  async cancelAppointment(appointmentId: string, buyerId: string) {
    ensureValidObjectId(appointmentId, "Appointment ID không hợp lệ");
    ensureValidObjectId(buyerId, "Buyer ID không hợp lệ");

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      buyer_id: buyerId,
    });

    if (!appointment) {
      throw Object.assign(new Error("Lịch hẹn không tồn tại"), { status: 404 });
    }

    if (appointment.status !== "pending") {
      throw Object.assign(
        new Error("Chỉ có thể hủy lịch hẹn đang ở trạng thái pending"),
        { status: 400 }
      );
    }

    appointment.status = "cancelled";
    await appointment.save();

    const [populatedAppointment, buyer, property] = await Promise.all([
      appointment.populate([
        { path: "property_id", select: "title" },
        { path: "agent_id", select: "fullName email phone avatar" },
        { path: "seller_id", select: "fullName email phone avatar" },
      ]),
      User.findById(buyerId).select("fullName").lean(),
      Property.findById(appointment.property_id).select("title").lean(),
    ]);

    const buyerName = buyer?.fullName || "Người mua";
    const propertyTitle =
      (property?.title as any)?.vi ||
      (property?.title as any)?.en ||
      "bất động sản";

    try {
      const appointmentId = appointment.id;
      await notifyAppointmentCancelled(
        appointment.agent_id.toString(),
        appointment.seller_id.toString(),
        buyerName,
        propertyTitle,
        appointmentId
      );
    } catch (error) {
      console.error("Failed to notify appointment cancellation:", error);
    }

    return populatedAppointment;
  },

  async getAppointmentsByAgent(
    agentId: string,
    filters: AgentAppointmentFilters = {}
  ) {
    ensureValidObjectId(agentId, "Agent ID không hợp lệ");

    const { page = 1, limit = 10, status, property_id, startDate, endDate } = filters;
    const pageNum = Number(page) > 0 ? Number(page) : 1;
    const limitNum = Number(limit) > 0 ? Number(limit) : 10;
    const skip = (pageNum - 1) * limitNum;

    const query: Record<string, any> = {
      agent_id: new mongoose.Types.ObjectId(agentId),
    };

    if (status) {
      query.status = status;
    }

    if (property_id) {
      ensureValidObjectId(property_id, "Property ID không hợp lệ");
      query.property_id = new mongoose.Types.ObjectId(property_id);
    }

    if (startDate || endDate) {
      query.time = {};
      if (startDate) {
        query.time.$gte = new Date(startDate);
      }
      if (endDate) {
        query.time.$lte = new Date(endDate);
      }
    }

    const [items, total] = await Promise.all([
      Appointment.find(query)
        .sort({ time: 1 })
        .skip(skip)
        .limit(limitNum)
        .populate("property_id", "title images price address status")
        .populate("buyer_id", "fullName email phone avatar")
        .populate("seller_id", "fullName email phone avatar")
        .lean(),
      Appointment.countDocuments(query),
    ]);

    return {
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
      data: items,
    };
  },

  async acceptAppointment(appointmentId: string, agentId: string) {
    ensureValidObjectId(appointmentId, "Appointment ID không hợp lệ");
    ensureValidObjectId(agentId, "Agent ID không hợp lệ");

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      agent_id: agentId,
    });

    if (!appointment) {
      throw Object.assign(new Error("Lịch hẹn không tồn tại hoặc không thuộc quyền quản lý của bạn"), { status: 404 });
    }

    if (appointment.status !== "pending") {
      throw Object.assign(
        new Error("Chỉ có thể chấp nhận lịch hẹn đang ở trạng thái pending"),
        { status: 400 }
      );
    }

    appointment.status = "accepted";
    await appointment.save();

    const [populatedAppointment, agent, property] = await Promise.all([
      appointment.populate([
        { path: "property_id", select: "title" },
        { path: "buyer_id", select: "fullName email phone avatar" },
        { path: "seller_id", select: "fullName email phone avatar" },
      ]),
      User.findById(agentId).select("fullName").lean(),
      Property.findById(appointment.property_id).select("title").lean(),
    ]);

    const agentName = agent?.fullName || "Agent";
    const propertyTitle =
      (property?.title as any)?.vi ||
      (property?.title as any)?.en ||
      "bất động sản";

    try {
      const appointmentIdStr = appointment.id;
      await notifyAppointmentStatusToBuyerAndSeller(
        appointment.buyer_id.toString(),
        appointment.seller_id.toString(),
        agentName,
        propertyTitle,
        "accepted",
        appointmentIdStr
      );
    } catch (error) {
      console.error("Failed to notify appointment acceptance:", error);
    }

    return populatedAppointment;
  },

  async rejectAppointment(appointmentId: string, agentId: string, reason?: string) {
    ensureValidObjectId(appointmentId, "Appointment ID không hợp lệ");
    ensureValidObjectId(agentId, "Agent ID không hợp lệ");

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      agent_id: agentId,
    });

    if (!appointment) {
      throw Object.assign(new Error("Lịch hẹn không tồn tại hoặc không thuộc quyền quản lý của bạn"), { status: 404 });
    }

    if (appointment.status !== "pending") {
      throw Object.assign(
        new Error("Chỉ có thể từ chối lịch hẹn đang ở trạng thái pending"),
        { status: 400 }
      );
    }

    appointment.status = "rejected";
    await appointment.save();

    const [populatedAppointment, agent, property] = await Promise.all([
      appointment.populate([
        { path: "property_id", select: "title" },
        { path: "buyer_id", select: "fullName email phone avatar" },
        { path: "seller_id", select: "fullName email phone avatar" },
      ]),
      User.findById(agentId).select("fullName").lean(),
      Property.findById(appointment.property_id).select("title").lean(),
    ]);

    const agentName = agent?.fullName || "Agent";
    const propertyTitle =
      (property?.title as any)?.vi ||
      (property?.title as any)?.en ||
      "bất động sản";

    try {
      const appointmentIdStr = appointment.id;
      await notifyAppointmentStatusToBuyerAndSeller(
        appointment.buyer_id.toString(),
        appointment.seller_id.toString(),
        agentName,
        propertyTitle,
        "rejected",
        appointmentIdStr
      );
    } catch (error) {
      console.error("Failed to notify appointment rejection:", error);
    }

    return populatedAppointment;
  },
  async completeAppointment(appointmentId: string, agentId: string) {
    ensureValidObjectId(appointmentId, "Appointment ID không hợp lệ");
    ensureValidObjectId(agentId, "Agent ID không hợp lệ");
  
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      agent_id: agentId,
    });
  
    if (!appointment) {
      throw Object.assign(
        new Error("Không tìm thấy lịch hẹn hoặc không thuộc quyền quản lý của bạn"),
        { status: 404 }
      );
    }
  
    if (appointment.status !== "accepted") {
      throw Object.assign(
        new Error("Chỉ có thể hoàn tất lịch hẹn ở trạng thái 'accepted'"),
        { status: 400 }
      );
    }
    if (appointment.time > new Date()) {
      throw Object.assign(
        new Error("Chưa thể hoàn tất lịch hẹn trước khi diễn ra"),
        { status: 400 }
      );
    }
    appointment.status = "completed";
    await appointment.save();
   
    const [agent, property] = await Promise.all([
      User.findById(agentId).select("fullName").lean(),
      Property.findById(appointment.property_id).select("title").lean(),
    ]);
  
    const agentName = agent?.fullName || "Agent";
  
    const propertyTitle =
      (property?.title as any)?.vi ||
      (property?.title as any)?.en ||
      "bất động sản";
  
    
    try {
      await notifyAppointmentCompleted(
        appointment.buyer_id.toString(),
        appointment.seller_id.toString(),
        agentName,
        propertyTitle,
        appointment.id
      );
    } catch (error) {
      console.error("Failed to notify appointment completion:", error);
    }
  
    return appointment;
  },
};

