import mongoose from "mongoose";
import Appointment, { AppointmentStatus } from "../models/appointment.model";
import Property from "../models/property.model";
import User from "../models/user.model";
import {
  notifyNewAppointment,
  notifySellerNewAppointment,
  notifyAppointmentCancelled,
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
};

