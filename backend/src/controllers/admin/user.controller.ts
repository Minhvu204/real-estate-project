import { Request, Response } from "express";
import { successResponse, errorResponse } from "../../utils/responseHandler";
import * as userService from "../../services/admin/user.service";

export const getAllUsers = async (req: any, res: Response) => {
  try {
    const { role, page = 1, limit = 10 } = req.query;
    const data = await userService.getAllUsers(
      role,
      Number(page),
      Number(limit)
    );
    return successResponse(res, "Lấy danh sách người dùng thành công", data);
  } catch (error) {
    return errorResponse(res, "Lấy danh sách người dùng thất bại", 500);
  }
};
