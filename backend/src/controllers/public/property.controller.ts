import { Request, Response } from "express";
import { propertyService } from "../../services/property.service";
import { successResponse, errorResponse } from "../../utils/responseHandler";

export const getAllProperties = async (req: Request, res: Response) => {
  try {
    const result = await propertyService.getAllProperties(req.query);
    return successResponse(res, "Danh sách bất động sản", result);
  } catch (error) {
    console.error("getAllProperties error:", error);
    return errorResponse(res, "Server error", 500);
  }
};
