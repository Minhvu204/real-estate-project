import { Request, Response } from "express";
import { successResponse, errorResponse } from "../../../utils/responseHandler";
import { assignmentService } from "../../../services/assignment.service";

export const createAssignmentRequest = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const propertyId = req.params.id;
    const { agent_id, note } = req.body;
    if (!agent_id) return errorResponse(res, "Thiếu agent_id", 400);

    const doc = await assignmentService.createRequest(propertyId, agent_id, user.id || user._id, note);
    return successResponse(res, "Tạo yêu cầu gán agent thành công", doc);
  } catch (error: any) {
    console.error("createAssignmentRequest error:", error);
    return errorResponse(res, error.message, error.status || 500);
  }
};

export const cancelAssignmentRequest = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { id } = req.params;
    const doc = await assignmentService.cancelRequest(id, user.id || user._id);
    return successResponse(req, res, "Hủy yêu cầu gán agent thành công", doc);
  } catch (error: any) {
    console.error("cancelAssignmentRequest error:", error);
    return errorResponse(req, res, error.message, error.status || 500);
  }
};
