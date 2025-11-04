import { Request, Response } from "express";
import { successResponse, errorResponse } from "../../../utils/responseHandler";
import { userService } from "../../../services/common/user.service";

export const getAgentList = async (req: Request, res: Response) => {
	try {
		const filters = req.query || {};
		const result = await userService.getAgents(filters);
		return successResponse(res, "Danh sách agent", result);
	} catch (error: any) {
		console.error("getAgentList error:", error);
		return errorResponse(res, error.message || "Lỗi server", error.status || 500);
	}
};
