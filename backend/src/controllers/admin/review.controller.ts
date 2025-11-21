import { Request, Response } from "express";
import { successResponse, errorResponse } from "../../utils/responseHandler";
import { adminReviewService } from "../../services/admin/review.admin.service";

export const listReviews = async (req: Request, res: Response) => {
  try {
    const result = await adminReviewService.getReviews(req.query);
    return successResponse(req, res, "Lấy danh sách review thành công", result);
  } catch (err: any) {
    return errorResponse(
      req,
      res,
      err.message || "Không thể lấy danh sách review",
      err.status || 500
    );
  }
};

export const approveReview = async (req: Request, res: Response) => {
  try {
    const review = await adminReviewService.approve(req.params.id);
    return successResponse(req, res, "Duyệt review thành công", review);
  } catch (err: any) {
    return errorResponse(
      req,
      res,
      err.message || "Không thể duyệt review",
      err.status || 500
    );
  }
};

export const rejectReview = async (req: Request, res: Response) => {
  try {
    const { reason } = req.body;
    if (!reason) {
      return errorResponse(req, res, "Vui lòng nhập lý do từ chối", 400);
    }

    const review = await adminReviewService.reject(req.params.id, reason);
    return successResponse(req, res, "Từ chối review thành công", review);
  } catch (err: any) {
    return errorResponse(
      req,
      res,
      err.message || "Không thể từ chối review",
      err.status || 500
    );
  }
};

export const hideReview = async (req: Request, res: Response) => {
  try {
    const review = await adminReviewService.hide(req.params.id);
    return successResponse(req, res, "Ẩn review thành công", review);
  } catch (err: any) {
    return errorResponse(
      req,
      res,
      err.message || "Không thể ẩn review",
      err.status || 500
    );
  }
};

export const unhideReview = async (req: Request, res: Response) => {
  try {
    const review = await adminReviewService.unhide(req.params.id);
    return successResponse(req, res, "Bỏ ẩn review thành công", review);
  } catch (err: any) {
    return errorResponse(
      req,
      res,
      err.message || "Không thể bỏ ẩn review",
      err.status || 500
    );
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    await adminReviewService.delete(req.params.id);
    return successResponse(req, res, "Xóa review thành công", null);
  } catch (err: any) {
    return errorResponse(
      req,
      res,
      err.message || "Không thể xoá review",
      err.status || 500
    );
  }
};
