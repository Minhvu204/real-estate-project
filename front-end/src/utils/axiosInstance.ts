import axios from "axios";

export const createAxiosInstance = () => {
    const token = localStorage.getItem("auth_token");
    
    console.log("🔑 Token from localStorage:", token ? `${token.substring(0, 20)}...` : "❌ NOT FOUND");
    
    if (!token) {
        console.error("❌ No auth_token found in localStorage!");
        console.log("📦 Available localStorage keys:", Object.keys(localStorage));
        console.warn("⚠️ User chưa đăng nhập hoặc token đã hết hạn");
    }
    
    const instance = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
        timeout: 10000,
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    });
    
    console.log("🔧 Axios headers:", instance.defaults.headers);
    
    return instance;
};

