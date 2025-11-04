import { Request, Response } from "express";
import * as featureService from "../../services/admin/feature.service";
import { successResponse, errorResponse } from "../../utils/responseHandler";

export const getAllFeatures = async (_req: Request, res: Response) => {
  try {
    const features = await featureService.getAllFeatures();
    return successResponse(res, "Lấy danh sách tính năng thành công", features);
  } catch (error: any) {
    return errorResponse(res, error.message);
  }
};

export const createFeature = async (req: Request, res: Response) => {
  try {
    const newFeature = await featureService.createFeature(req.body);
    return successResponse(res, "Tạo tính năng mới thành công", newFeature);
  } catch (error: any) {
    return errorResponse(res, error.message);
  }
};

export const updateFeature = async (req: Request, res: Response) => {
  try {
    const updatedFeature = await featureService.updateFeature(req.params.id, req.body);
    return successResponse(res, "Cập nhật tính năng thành công", updatedFeature);
  } catch (error: any) {
    return errorResponse(res, error.message);
  }
};

export const deleteFeature = async (req: Request, res: Response) => {
  try {
    await featureService.deleteFeature(req.params.id);
    return successResponse(res, "Xóa tính năng thành công");
  } catch (error: any) {
    return errorResponse(res, error.message);
  }
};
