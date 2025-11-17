import { Request, Response } from "express";
import { offerService } from "../../../services/offer.service";
import { successResponse, errorResponse } from "../../../utils/responseHandler";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role?: string;
    email?: string;
  };
}

export const getOfferById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId || !userRole) {
      return errorResponse(req, res, "Không xác thực được người dùng", 401);
    }

    if (userRole.toLowerCase() !== "agent") {
      return errorResponse(req, res, "Chỉ agent mới có quyền truy cập", 403);
    }

    const { id } = req.params;
    if (!id) {
      return errorResponse(req, res, "Thiếu offer id", 400);
    }

    const offer = await offerService.getOfferById(id, userId, userRole.toLowerCase());

    return successResponse(req, res, "Lấy thông tin offer thành công", offer);
  } catch (error: any) {
    const statusCode = error?.status || 500;
    return errorResponse(req, res, error.message || "Không thể lấy thông tin offer", statusCode);
  }
};

