import { Request, Response } from "express";
import { propertyService } from "../../../services/property.service";
import { successResponse, errorResponse } from "../../../utils/responseHandler";

export const updateProperty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const user = (req as any).user as { id: string };

    const payload: any = { ...req.body };

    // Xử lý images:
    // - Nếu có upload files mới: middleware đã gán req.body.images = URLs mới
    // - Nếu có images trong body: giữ nguyên (có thể là URLs hoặc mảng URLs)
    // - Nếu không có images trong payload: không update images field
    if (payload.images !== undefined) {
      if (typeof payload.images === "string") {
        payload.images = [payload.images];
      } else if (!Array.isArray(payload.images)) {
        // Nếu không phải string và không phải array, xóa field
        delete payload.images;
      }
      // Nếu là array rỗng [], giữ nguyên để xóa hết images
    }

    const updated = await propertyService.updateProperty(id, payload, user.id);
    return successResponse(res, "Cập nhật bất động sản thành công", updated);
  } catch (error: any) {
    const status = error.status || 500;
    return errorResponse(res, error.message || "Không thể cập nhật bất động sản", status);
  }
};

export const deleteProperty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const user = (req as any).user as { id: string };

    await propertyService.deleteProperty(id, user.id);
    return successResponse(res, "Xóa mềm bất động sản thành công", { id });
  } catch (error: any) {
    const status = error.status || 500;
    return errorResponse(res, error.message || "Không thể xóa bất động sản", status);
  }
};

