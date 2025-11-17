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
    let aiMessage = "";
    if(results.length > 0) {
      aiMessage = `Dựa trên yêu cầu của bạn, tôi đã tìm thấy ${results.length} kết quả phù hợp.`;
    }else{
      aiMessage = `Rất tiếc, tôi không tìm thấy kết quả nào phù hợp với yêu cầu của bạn. Vui lòng thử lại với các tiêu chí khác.`;
    }
    
    return successResponse(res, aiMessage, {
      properties: results,
    });

  } catch (error: any) {
    console.error("AI search error:", error);
    return errorResponse(res, error.message, error.status || 500);
  }
};