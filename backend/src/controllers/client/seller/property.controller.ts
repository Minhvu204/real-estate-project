import { Request, Response } from "express";
import Property from "../../../models/property.model";
import { successResponse, errorResponse } from "../../../utils/responseHandler";
import { propertyService } from "../../../services/property.service";

/**
 * POST /api/client/seller/properties/:id/assign-agent
 * body: { agent_id: string }
 */
export const assignAgentToProperty = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const propertyId = req.params.id;
    const { agent_id } = req.body;

    if (!agent_id) return errorResponse(req, res, "Thiếu agent_id", 400);

    // Lấy property
    const property = await Property.findById(propertyId);
    if (!property) return errorResponse(req, res, "Property không tồn tại", 404);

    // Kiểm tra quyền
    const isOwner = property.owner_id?.toString() === (user?.id || user?._id);

    if (!isOwner) return errorResponse(req, res, "Không có quyền gán agent", 403);

    // Nếu đã có agent thì yêu cầu huỷ gán trước (không cho overwrite trực tiếp)
    if (property.agent_id) {
      return errorResponse(
        req,
        res,
        "Property đã có agent, vui lòng huỷ gán agent hiện tại trước khi gán agent mới",
        409
      );
    }

    const updated = await propertyService.assignAgent(propertyId, agent_id, {
      actorId: (user?.id || user?._id),
    });

    return successResponse(req, res, "Gán agent thành công", updated);
  } catch (error: any) {
    console.error("assignAgentToProperty error:", error);
    return errorResponse(req, res, error.message || "Lỗi server", 500);
  }
};

/**
 * POST /api/client/seller/properties/:id/remove-agent
 */
export const removeAgentFromProperty = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const propertyId = req.params.id;

    const property = await Property.findById(propertyId);
    if (!property) return errorResponse(req, res, "Property không tồn tại", 404);

    const isOwner = property.owner_id?.toString() === (user?.id || user?._id);
    if (!isOwner) return errorResponse(req, res, "Không có quyền huỷ agent", 403);

    const updated = await propertyService.removeAgent(propertyId, {
      actorId: (user?.id || user?._id),
    });

    return successResponse(req, res, "Huỷ gán agent thành công", updated);
  } catch (error: any) {
    console.error("removeAgentFromProperty error:", error);
    return errorResponse(req, res, error.message || "Lỗi server", 500);
  }
};

//POST /api/client/seller/properties/create
export const createProperty = async (req: Request, res: Response) => {
  try {
    const ownerId = (req as any).user?.id;
    if (!ownerId) {
      return res.status(401).json({ message: "Không xác định được người dùng" });
    }

    const body = req.body;

    // middleware uploadMultipleToCloudinary đã gắn req.body.images = string[]
    const imageUrls = body.images || [];

    const newProperty = await propertyService.createProperty(
      { ...body, images: imageUrls },
      ownerId
    );

    return successResponse(req, res, "property.create_success", newProperty);

  } catch (err: any) {
    console.error("Lỗi khi tạo property:", err);
    return errorResponse(req, res, "property.create_failed", 500);
  }
};