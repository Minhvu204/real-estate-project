import { Request, Response } from "express";
import mongoose from "mongoose";
import Property from "../../../models/property.model";
import { successResponse, errorResponse } from "../../../utils/responseHandler";

export const getPropertiesByIds = async (req: Request, res: Response) => {
  try {
    const idsParam = req.query.ids as string;

    if (!idsParam) {
      return errorResponse(req, res, "Thiếu danh sách ID (ids)", 400);
    }

    const ids = idsParam.split(",");

    const invalidIds = ids.filter((id) => !mongoose.isValidObjectId(id));
    if (invalidIds.length > 0) {
      return errorResponse(
        req,
        res,
        `ID không hợp lệ: ${invalidIds.join(", ")}`,
        400
      );
    }

    const properties = await Property.find({
      _id: { $in: ids },
      deleted: false,
      status: "approved",
    });

    return successResponse(
      req,
      res,
      "Lấy danh sách bất động sản thành công",
      properties
    );
  } catch (error: any) {
    return errorResponse(req, res, error.message, 500);
  }
};
