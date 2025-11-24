import { Request, Response } from "express";
import { successResponse, errorResponse } from "../../utils/responseHandler";
import { adminReviewService } from "../../services/admin/review.admin.service";

export const listReviews = async (req: Request, res: Response) => {
  try {
    const result = await adminReviewService.getReviews(req.query);
    return successResponse(req, res, "Lấy danh sách review thành công", result);
  } catch (err: any) {
    return errorResponse(req, res, err.message, err.status || 500);
  }
};

export const getReviewDetail = async (req: Request, res: Response) => {
  try {
    const result = await adminReviewService.getReviewDetail(req.params.id);
    return successResponse(req, res, "Lấy chi tiết review thành công", result);
  } catch (err: any) {
    return errorResponse(req, res, err.message, err.status || 500);
  }
};


export const hideReview = async (req: Request, res: Response) => {
  try {
    const review = await adminReviewService.hide(req.params.id);
    return successResponse(req, res, "Ẩn review thành công", review);
  } catch (err: any) {
    return errorResponse(req, res, err.message, err.status || 500);
  }
};

export const unhideReview = async (req: Request, res: Response) => {
  try {
    const review = await adminReviewService.unhide(req.params.id);
    return successResponse(req, res, "Bỏ ẩn review thành công", review);
  } catch (err: any) {
    return errorResponse(req, res, err.message, err.status || 500);
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    await adminReviewService.delete(req.params.id);
    return successResponse(req, res, "Xóa review thành công", null);
  } catch (err: any) {
    return errorResponse(req, res, err.message, err.status || 500);
  }
};
