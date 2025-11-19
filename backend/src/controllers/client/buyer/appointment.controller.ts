import { Request, Response } from "express";
import { appointmentService } from "../../../services/appointment.service";
import { successResponse, errorResponse } from "../../../utils/responseHandler";
import { AppointmentStatus } from "../../../models/appointment.model";

interface AuthenticatedRequest extends Request {
  user?: {
    id?: string;
    _id?: string;
    role?: string;
  };
}

export const createAppointment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const buyerId = req.user?.id || req.user?._id;
    if (!buyerId) {
      return errorResponse(req, res, "Unauthorized", 401);
    }

    const { propertyId, time, note, location } = req.body || {};

    if (!propertyId) {
      return errorResponse(req, res, "Vui lòng chọn bất động sản", 400);
    }

    if (!time) {
      return errorResponse(req, res, "Vui lòng chọn thời gian lịch hẹn", 400);
    }

    const appointment = await appointmentService.createAppointment({
      propertyId: String(propertyId),
      buyerId: String(buyerId),
      time,
      note,
      location,
    });

    return successResponse(req, res, "Đặt lịch hẹn thành công", appointment);
  } catch (error: any) {
    return errorResponse(req, res, error.message || "Server error", error.status || 500);
  }
};

export const getMyAppointments = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const buyerId = req.user?.id || req.user?._id;
    if (!buyerId) {
      return errorResponse(req, res, "Unauthorized", 401);
    }

    const { page, limit, status, property_id } = req.query || {};

    const filters: any = {};
    if (page) filters.page = Number(page);
    if (limit) filters.limit = Number(limit);
    if (status) filters.status = status as AppointmentStatus;
    if (property_id) filters.property_id = String(property_id);

    const result = await appointmentService.getAppointmentsByBuyer(String(buyerId), filters);
    return successResponse(req, res, "Lấy danh sách lịch hẹn thành công", result);
  } catch (error: any) {
    return errorResponse(req, res, error.message || "Server error", error.status || 500);
  }
};

export const cancelAppointment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const buyerId = req.user?.id || req.user?._id;
    if (!buyerId) {
      return errorResponse(req, res, "Unauthorized", 401);
    }

    const { id } = req.params;
    if (!id) {
      return errorResponse(req, res, "Appointment ID không hợp lệ", 400);
    }

    const appointment = await appointmentService.cancelAppointment(String(id), String(buyerId));
    return successResponse(req, res, "Hủy lịch hẹn thành công", appointment);
  } catch (error: any) {
    return errorResponse(req, res, error.message || "Server error", error.status || 500);
  }
};

