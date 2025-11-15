// src/controllers/client/common/chat.controller.ts
import { Request, Response } from "express";
import { successResponse, errorResponse } from "../../../utils/responseHandler";
import { chatService } from "../../../services/chat.service";

export const handleAiSearch = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    if (!message) {
      return errorResponse(res, "Missing 'message'", 400);
    }

    const results = await chatService.searchWithAi(message);
    
    // Tạo một câu trả lời thân thiện
    const aiMessage = `Dựa trên yêu cầu của bạn, tôi đã tìm thấy ${results.length} kết quả phù hợp.`;

    return successResponse(res, aiMessage, {
      properties: results,
    });

  } catch (error: any) {
    console.error("AI search error:", error);
    return errorResponse(res, error.message, error.status || 500);
  }
};