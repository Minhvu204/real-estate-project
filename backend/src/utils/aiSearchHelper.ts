// src/utils/aiSearchHelper.ts
import { GoogleGenAI } from "@google/genai";
import { SearchCriteria } from "../types/searchCriteria";

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      throw new Error("Thiếu GEMINI_API_KEY trong .env");
    }

    aiClient = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    console.log("[AI] GoogleGenAI client initialized.");
  }
  return aiClient;
}

async function callLargeLanguageModel(
  message: string
): Promise<SearchCriteria> {
  console.log(`[AI] Phân tích câu: "${message}"`);

  const prompt = `
    Phân tích câu chat của người dùng sau đây và trích xuất thông tin
    thành một đối tượng JSON. Các trường có thể có là:
    'location_query' (địa điểm), 
    'min_price' (giá tối thiểu, nếu có "trên" hoặc "từ"), 
    'max_price' (giá tối đa, nếu có "dưới" hoặc "tầm"), 
    'category' (loại BĐS), 
    'features' (mảng các tiện ích).
    
    Chỉ trả về JSON.

    Ví dụ 1: "tìm căn hộ gần FPT dưới 5 tỷ có hồ bơi"
    JSON: { "location_query": "FPT Đà Nẵng", "max_price": 5000000000, "category": "căn hộ", "features": ["hồ bơi"] }

    Ví dụ 2: "biệt thự trên 10 tỷ"
    JSON: { "min_price": 10000000000, "category": "biệt thự" }
    
    Câu của người dùng: "${message}"
    JSON:
  `;

  try {
    const ai = getAIClient();

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    // ⚠️ Đây mới là cách đúng: .text là getter property
    const rawText = response.text;

    const cleanJson = String(rawText).replace(/```json/g, "").replace(/```/g, "").trim();

    console.log("[AI] JSON nhận được:", cleanJson);

    return JSON.parse(cleanJson);
  } catch (err: any) {
    console.error("Lỗi gọi Gemini:", err.message);
    return { location_query: message };
  }
}

export const aiSearchHelper = {
  async parseSearchIntent(message: string): Promise<SearchCriteria> {
    return await callLargeLanguageModel(message);
  },
};
