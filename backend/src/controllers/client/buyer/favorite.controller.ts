// src/controllers/client/buyer/favorite.controller.ts
import { Request, Response } from "express";
import { favoriteService } from "../../../services/favorite.service";
import { successResponse, errorResponse } from "../../../utils/responseHandler";

interface AuthenticatedRequest extends Request {
  user?: {
    id?: string;
    _id?: string;
    role?: string;
  };
}

export const addFavorite = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const buyerId = req.user?.id || req.user?._id;
    if (!buyerId) {
      return errorResponse(req, res, "Không xác thực được người dùng", 401);
    }

    const { property_id } = req.body || {};
    if (!property_id) {
      return errorResponse(req, res, "Thiếu property_id", 400);
    }

    const favorite = await favoriteService.addFavorite(
      String(buyerId),
      String(property_id)
    );

    return successResponse(
      req,
      res,
      "Thêm vào danh sách yêu thích thành công",
      favorite
    );
  } catch (error: any) {
    const statusCode = error?.status || 500;
    return errorResponse(
      req,
      res,
      error.message || "Không thể thêm vào danh sách yêu thích",
      statusCode
    );
  }
};

export const removeFavorite = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const buyerId = req.user?.id || req.user?._id;
    if (!buyerId) {
      return errorResponse(req, res, "Không xác thực được người dùng", 401);
    }

    const { propertyId } = req.params;
    if (!propertyId) {
      return errorResponse(req, res, "Property ID không hợp lệ", 400);
    }

    await favoriteService.removeFavorite(String(buyerId), String(propertyId));

    return successResponse(
      req,
      res,
      "Xóa khỏi danh sách yêu thích thành công",
      null
    );
  } catch (error: any) {
    const statusCode = error?.status || 500;
    return errorResponse(
      req,
      res,
      error.message || "Không thể xóa khỏi danh sách yêu thích",
      statusCode
    );
  }
};

export const getMyFavorites = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const buyerId = req.user?.id || req.user?._id;
    if (!buyerId) {
      return errorResponse(req, res, "Không xác thực được người dùng", 401);
    }

    const { page, limit, sort } = req.query || {};

    const filters: any = {};
    if (page) filters.page = Number(page);
    if (limit) filters.limit = Number(limit);
    if (sort) filters.sort = String(sort);

    const result = await favoriteService.getFavorites(String(buyerId), filters);

    return successResponse(
      req,
      res,
      "Lấy danh sách bất động sản yêu thích thành công",
      result
    );
  } catch (error: any) {
    const statusCode = error?.status || 500;
    return errorResponse(
      req,
      res,
      error.message || "Không thể lấy danh sách yêu thích",
      statusCode
    );
  }
};

export const checkFavorite = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const buyerId = req.user?.id || req.user?._id;

    const { propertyId } = req.params;
    if (!propertyId) {
      return errorResponse(req, res, "Property ID không hợp lệ", 400);
    }

    if (!buyerId) {
      return successResponse(req, res, "Trạng thái yêu thích", {
        isFavorite: false,
        favorite: null,
      });
    }

    const favorite = await favoriteService.isFavorite(
      String(buyerId),
      String(propertyId)
    );

    return successResponse(req, res, "Trạng thái yêu thích", {
      isFavorite: !!favorite,
      favorite,
    });
  } catch (error: any) {
    const statusCode = error?.status || 500;
    return errorResponse(
      req,
      res,
      error.message || "Không thể kiểm tra trạng thái yêu thích",
      statusCode
    );
  }
};
