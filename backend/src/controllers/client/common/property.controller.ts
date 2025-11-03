import { Request, Response } from "express";
import { propertyService } from "../../../services/property.service";
import { successResponse, errorResponse } from "../../../utils/responseHandler";

export const updateProperty = async (req: Request, res: Response) => {
	try {
		const userId = (req as any).user?.id || (req as any).user?._id;
		if (!userId) return errorResponse(req, res, "Unauthorized", 401);

		const { id } = req.params;
		const body = req.body || {};

		// Middleware uploadMultiple đã gắn req.body.images = string[] nếu có tải ảnh
		const updated = await propertyService.updateProperty(id, body, String(userId));
		return successResponse(req, res, "Cập nhật bất động sản thành công", updated);
	} catch (error: any) {
		console.error("updateProperty error:", error);
		return errorResponse(req, res, error.message || "Server error", error.status || 500);
	}
};

export const deleteProperty = async (req: Request, res: Response) => {
	try {
		const userId = (req as any).user?.id || (req as any).user?._id;
		if (!userId) return errorResponse(req, res, "Unauthorized", 401);

		const { id } = req.params;
		await propertyService.deleteProperty(id, String(userId));
		return successResponse(req, res, "Xoá bất động sản (soft-delete) thành công", { id });
	} catch (error: any) {
		console.error("deleteProperty error:", error);
		return errorResponse(req, res, error.message || "Server error", error.status || 500);
	}
};


