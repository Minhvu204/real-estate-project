import { Request, Response } from "express";
import { successResponse, errorResponse } from "../../utils/responseHandler";
import { adminReviewService } from "../../services/admin/review.service";

export const listReviews = async (req: Request, res: Response) => {
  try {
    const result = await adminReviewService.getReviews(req.query);
    return successResponse(req, res, "Lấy danh sách review thành công", result);
  } catch (err: any) {
    return errorResponse(req, res, err.message, err.status);
  }
};

export const approveReview = async (req: Request, res: Response) => {
  try {
    const review = await adminReviewService.approve(req.params.id);
    return successResponse(req, res, "Duyệt review thành công", review);
  } catch (err: any) {
    return errorResponse(req, res, err.message, err.status);
  }
};

export const rejectReview = async (req: Request, res: Response) => {
  try {
    const { reason } = req.body;
    const review = await adminReviewService.reject(req.params.id, reason);
    return successResponse(req, res, "Từ chối review thành công", review);
  } catch (err: any) {
    return errorResponse(req, res, err.message, err.status);
  }
};

export const hideReview = async (req: Request, res: Response) => {
  try {
    const review = await adminReviewService.hide(req.params.id);
    return successResponse(req, res, "Ẩn review thành công", review);
  } catch (err: any) {
    return errorResponse(req, res, err.message, err.status);
  }
};

export const unhideReview = async (req: Request, res: Response) => {
  try {
    const review = await adminReviewService.unhide(req.params.id);
    return successResponse(req, res, "Bỏ ẩn review thành công", review);
  } catch (err: any) {
    return errorResponse(req, res, err.message, err.status);
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    await adminReviewService.delete(req.params.id);
    return successResponse(req, res, "Xóa review thành công", null);
  } catch (err: any) {
    return errorResponse(req, res, err.message, err.status);
  }
};
