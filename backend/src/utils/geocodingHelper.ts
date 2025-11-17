// src/utils/geocodingHelper.ts
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY;

/**
 * Chuyển đổi một địa chỉ thành tọa độ (lat, lng) dùng OpenCage
 * @param address Chuỗi địa chỉ (ví dụ: "123 Đường ABC, P. Mỹ An, Q. Ngũ Hành Sơn, Đà Nẵng")
 * @returns Object { lat, lng } hoặc null
 */
export async function geocodeAddress(
  address: string
): Promise<{ lat: number; lng: number } | null> {
  // 1. Kiểm tra xem có API key không
  if (!OPENCAGE_API_KEY) {
    console.warn(
      "OPENCAGE_API_KEY is not set. Geocoding will be skipped."
    );
    return null;
  }

  try {
    // 2. Gọi API của OpenCage
    const response = await axios.get(
      "https://api.opencagedata.com/geocode/v1/json",
      {
        params: {
          q: address, // OpenCage dùng 'q' (query) thay vì 'address'
          key: OPENCAGE_API_KEY,
          language: "vi", // Ưu tiên kết quả tiếng Việt
          limit: 1, // Chỉ cần 1 kết quả chính xác nhất
        },
      }
    );

    const data = response.data;

    // 3. Kiểm tra và trích xuất kết quả
    if (data.status.code === 200 && data.results[0]) {
      const location = data.results[0].geometry;
      // OpenCage trả về { lat, lng } trực tiếp trong 'geometry'
      return {
        lat: location.lat,
        lng: location.lng,
      };
    } else {
      console.warn(
        `OpenCage Geocoding failed for address "${address}": ${data.status.message}`
      );
      return null;
    }
  } catch (error: any) {
    console.error("OpenCage API error:", error.message);
    return null;
  }
}