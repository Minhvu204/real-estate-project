import { Request, Response } from "express";
import { successResponse, errorResponse } from "../../../utils/responseHandler";
import { contractService } from "../../../services/contract.service";

const BUYER_UPLOAD_ENABLED = process.env.ALLOW_BUYER_CONTRACT_UPLOAD === "true";

const getUserIdFromRequest = (req: Request) => {
  const user = (req as any).user;
  return user?.id || user?._id;
};

const extractFileUrl = (req: Request) => {
  const body = req.body as any;
  return body?.file_url || body?.file;
};

const parseBoolean = (value: any) => {
  if (typeof value === "boolean") return value;
  if (value === undefined || value === null) return false;
  return ["true", "1", "yes"].includes(String(value).toLowerCase());
};

export const listContracts = async (req: Request, res: Response) => {
  try {
    const buyerId = getUserIdFromRequest(req);
    if (!buyerId) {
      return errorResponse(req, res, "Không xác định người dùng", 401);
    }

    const includeHistory = parseBoolean(req.query.history);

    const contracts = await contractService.getContractsForBuyer(buyerId, {
      includeHistory,
    });

    return successResponse(req, res, "Lấy danh sách hợp đồng thành công", contracts);
  } catch (error: any) {
    const status = error?.status || 500;
    return errorResponse(req, res, error.message || "Lấy danh sách hợp đồng thất bại", status);
  }
};

export const getContractByDeal = async (req: Request, res: Response) => {
  try {
    const buyerId = getUserIdFromRequest(req);
    const { dealId } = req.params;

    if (!buyerId) {
      return errorResponse(req, res, "Không xác định người dùng", 401);
    }

    const contract = await contractService.getContractByDeal(dealId, buyerId);

    return successResponse(req, res, "Lấy hợp đồng thành công", contract);
  } catch (error: any) {
    const status = error?.status || 500;
    return errorResponse(req, res, error.message || "Lấy hợp đồng thất bại", status);
  }
};

export const downloadContract = async (req: Request, res: Response) => {
  try {
    const buyerId = getUserIdFromRequest(req);
    const { dealId } = req.params;

    if (!buyerId) {
      return errorResponse(req, res, "Không xác định người dùng", 401);
    }

    const contract = await contractService.getContractByDeal(dealId, buyerId);

    return successResponse(req, res, "Tải hợp đồng thành công", {
      download_url: contract.file_url,
      file_name: contract.original_filename,
      mime_type: contract.mime_type,
      file_size: contract.file_size,
      version: contract.version,
    });
  } catch (error: any) {
    const status = error?.status || 500;
    return errorResponse(req, res, error.message || "Tải hợp đồng thất bại", status);
  }
};

export const uploadContract = async (req: Request, res: Response) => {
  try {
    if (!BUYER_UPLOAD_ENABLED) {
      return errorResponse(req, res, "Tính năng upload hợp đồng cho Buyer chưa được kích hoạt", 403);
    }

    const buyerId = getUserIdFromRequest(req);
    const { dealId } = req.params;

    if (!buyerId) {
      return errorResponse(req, res, "Không xác định người dùng", 401);
    }

    const fileUrl = extractFileUrl(req);
    if (!fileUrl) {
      return errorResponse(req, res, "Không tìm thấy file tải lên", 400);
    }

    const notes = (req.body as any)?.notes;

    const contract = await contractService.createOrReplaceContract({
      dealId,
      buyerId,
      fileUrl,
      originalFilename: req.file?.originalname,
      mimeType: req.file?.mimetype,
      fileSize: req.file?.size,
      notes,
    });

    return successResponse(req, res, "Upload hợp đồng thành công", contract);
  } catch (error: any) {
    const status = error?.status || 500;
    return errorResponse(req, res, error.message || "Upload hợp đồng thất bại", status);
  }
};


