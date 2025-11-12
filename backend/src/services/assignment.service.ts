// src/services/assignment.service.ts
import Assignment from "../models/assignment.model";
import Property from "../models/property.model";
import mongoose from "mongoose";

export const assignmentService = {
  async createRequest(propertyId: string, agentId: string, ownerId: string, note?: string) {
    // check property exists & owner matches
    const property = await Property.findById(propertyId);
    if (!property) throw Object.assign(new Error("Property không tồn tại"), { status: 404 });
    if (property.owner_id?.toString() !== ownerId) throw Object.assign(new Error("Không có quyền"), { status: 403 });

    const existing = await Assignment.findOne({ property_id: propertyId, agent_id: agentId, status: "pending" });
    if (existing) throw Object.assign(new Error("Đã có yêu cầu đang chờ với agent này"), { status: 409 });

    const doc = await Assignment.create({
      property_id: propertyId,
      agent_id: agentId,
      owner_id: ownerId,
      note,
    });

    // push assignmentHistory
    property.assignmentHistory = property.assignmentHistory || [];
    property.assignmentHistory.push({
      agent_id: new mongoose.Types.ObjectId(agentId),
      assignedBy: new mongoose.Types.ObjectId(ownerId),
      action: "request",
      assignedAt: new Date(),
    });
    await property.save();

    //Optional: create notification to agent

    return doc;
  },

  async getRequestsForAgent(agentId: string, filters: any = {}) {
    const query: any = { agent_id: agentId };
    if (filters.status) query.status = filters.status;
    return Assignment.find(query)
      .populate("property_id", "title address price owner_id")
      .populate("owner_id", "fullName email phone")
      .sort({ createdAt: -1 })
      .lean();
  },

  async acceptRequest(assignmentId: string, agentId: string) {
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) throw Object.assign(
      new Error("Yêu cầu không tồn tại"),
      { status: 404 }
    );
    if (!assignment.agent_id || String(assignment.agent_id) !== String(agentId)) throw Object.assign(
      new Error("Không phải request của agent này"),
      { status: 403 }
    );
    if (assignment.status !== "pending") throw Object.assign(
      new Error("Yêu cầu không ở trạng thái pending"),
      { status: 400 }
    );

    // Set property.agent_id and push history
    const property = await Property.findById(assignment.property_id);
    if (!property) throw Object.assign(
      new Error("Property không tồn tại"),
      { status: 404 }
    );

    if (property.agent_id) throw Object.assign(
      new Error("Property đã có agent"),
      { status: 409 }
    );

    property.assignmentHistory = property.assignmentHistory || [];
    property.assignmentHistory.push({
      agent_id: assignment.agent_id,
      assignedBy: new mongoose.Types.ObjectId(agentId),
      action: "assign",
      assignedAt: new Date(),
    } as any);

    property.agent_id = assignment.agent_id;
    await property.save();

    assignment.status = "accepted";
    assignment.actedBy = new mongoose.Types.ObjectId(agentId);
    assignment.actedAt = new Date();
    await assignment.save();

    return { assignment, property };
  },

  async rejectRequest(assignmentId: string, agentId: string, reason?: string) {
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) throw Object.assign(new Error("Yêu cầu không tồn tại"), { status: 404 });
    if (!assignment.agent_id || String(assignment.agent_id) !== String(agentId)) throw Object.assign(new Error("Không phải request của agent này"), { status: 403 });
    if (assignment.status !== "pending") throw Object.assign(new Error("Yêu cầu không ở trạng thái pending"), { status: 400 });

    assignment.status = "rejected";
    assignment.actedBy = new mongoose.Types.ObjectId(agentId);
    assignment.actedAt = new Date();
    if (reason) (assignment as any).note = reason;
    await assignment.save();

    const property = await Property.findById(assignment.property_id);
    if (property) {
      property.assignmentHistory = property.assignmentHistory || [];
      property.assignmentHistory.push({
        agent_id: assignment.agent_id,
        assignedBy: new mongoose.Types.ObjectId(agentId),
        action: "reject",
        assignedAt: new Date(),
      } as any);
      await property.save();
    }

    return assignment;
  },

    async cancelRequest(assignmentId: string, ownerId: string) {
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) throw Object.assign(new Error("Yêu cầu không tồn tại"), { status: 404 });

    // Kiểm tra quyền (chỉ owner của request mới được hủy)
    if (String(assignment.owner_id) !== String(ownerId)) {
      throw Object.assign(new Error("Không có quyền hủy yêu cầu này"), { status: 403 });
    }

    // chỉ được hủy khi còn pending
    if (assignment.status !== "pending") {
      throw Object.assign(new Error("Chỉ có thể hủy yêu cầu khi đang ở trạng thái pending"), { status: 400 });
    }

    // Cập nhật trạng thái
    assignment.status = "cancelled";
    assignment.actedBy = new mongoose.Types.ObjectId(ownerId);
    assignment.actedAt = new Date();
    await assignment.save();

    // Ghi lại vào lịch sử property
    const property = await Property.findById(assignment.property_id);
    if (property) {
      property.assignmentHistory = property.assignmentHistory || [];
      property.assignmentHistory.push({
        agent_id: assignment.agent_id,
        assignedBy: new mongoose.Types.ObjectId(ownerId),
        action: "cancel",
        assignedAt: new Date(),
      } as any);
      await property.save();
    }

    // Optional: tạo notification cho agent rằng request đã bị hủy
    return assignment;
  },

};