import { Request, Response } from "express";
import * as categoryService from "../../services/admin/category.service";
import { successResponse, errorResponse } from "../../utils/responseHandler";


export const getAllCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await categoryService.getAllCategories();
    return successResponse(res, "Lấy danh sách danh mục thành công", categories);
  } catch (error: any) {
    return errorResponse(res, error.message);
  }
};


export const createCategory = async (req: Request, res: Response) => {
  try {
    const newCategory = await categoryService.createCategory(req.body);
    return successResponse(res, "Tạo danh mục mới thành công", newCategory);
  } catch (error: any) {
    return errorResponse(res, error.message);
  }
};


export const updateCategory = async (req: Request, res: Response) => {
  try {
    const updatedCategory = await categoryService.updateCategory(req.params.id, req.body);
    return successResponse(res, "Cập nhật danh mục thành công", updatedCategory);
  } catch (error: any) {
    return errorResponse(res, error.message);
  }
};


export const deleteCategory = async (req: Request, res: Response) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    return successResponse(res, "Xóa danh mục thành công (đã đánh dấu deleted).");
  } catch (error: any) {
    return errorResponse(res, error.message);
  }
};
