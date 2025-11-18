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

// Hàm tạo AI mô tả bất động sản
async function callGeneratorModel(
  data: any,
  lang: "vi" | "en"
): Promise<string> {
  console.log(`[AI] Đang tạo mô tả...`);
  const langText = lang === "vi" ? "Tiếng Việt" : "Tiếng Anh";

  //Xây dựng chuỗi thông tin chi tiết từ req.body
  const {
    title,
    price,
    category_name, 
    type_name,   
    bedrooms,
    bathrooms,
    area,
    address,
    ward_name,
    district_name,
    city_name,
    features_names, 
    floor_number,
    building_block,
    apartment_number,
  } = data;

  let details = [];
  if (title) details.push(`- Tiêu đề: ${title}`);
  if (category_name) details.push(`- Loại BĐS: ${category_name}`);
  if (type_name) details.push(`- Hình thức: ${type_name}`);
  if (price) details.push(`- Giá: ${Number(price).toLocaleString()} VND`);
  if (area) details.push(`- Diện tích: ${area} m2`);
  if (bedrooms) details.push(`- Phòng ngủ: ${bedrooms}`);
  if (bathrooms) details.push(`- Phòng tắm: ${bathrooms}`);

  // Ghép địa chỉ
  let fullAddress = [address, ward_name, district_name, city_name]
    .filter(Boolean)
    .join(", ");
  if (fullAddress) details.push(`- Địa chỉ: ${fullAddress}`);

  // Thông tin căn hộ
  if (building_block) details.push(`- Tòa nhà: ${building_block}`);
  if (floor_number) details.push(`- Tầng: ${floor_number}`);
  if (apartment_number) details.push(`- Mã căn: ${apartment_number}`);

  if (features_names && features_names.length > 0) {
    details.push(`- Tiện ích: ${features_names.join(", ")}`);
  }

  // Tạo Prompt
  const prompt = `
    Bạn là một chuyên gia môi giới bất động sản hàng đầu tại Việt Nam.
    Hãy viết một mô tả (dưới 200 chữ) bất động sản thật hấp dẫn, lôi cuốn, và chuẩn SEO bằng ${langText}.
    Tuyệt đối không chỉ liệt kê thông tin, mà hãy "bán" trải nghiệm và phong cách sống.
    
    Dữ liệu bất động sản:
    ${details.join("\n")}

    Mô tả (chỉ trả về phần mô tả, không thêm tiêu đề):
  `;

  // Gọi AI
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash", 
      contents: prompt,
    });

    const rawText = response.text;
    const cleanJson = String(rawText).replace(/```json/g, "").replace(/```/g, "").trim();

    console.log("[AI] Mô tả đã tạo:", cleanJson);
    return cleanJson;

  } catch (err: any) {
    console.error("Lỗi gọi Gemini (Generate Description):", err.message);
    return ""; // Trả về rỗng nếu lỗi
  }
}

export const aiSearchHelper = {
  async parseSearchIntent(message: string): Promise<SearchCriteria> {
    return await callLargeLanguageModel(message);
  },

  // AI tạo mô tả bất động sản
  async generateDescription(
    data: any,
    lang: "vi" | "en"
  ): Promise<string> {
    return await callGeneratorModel(data, lang);
  },
};
