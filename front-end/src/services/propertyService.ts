import type { Property } from "../types/Property";
import { httpClient } from "../utils/httpClient";
import { createAxiosInstance } from "../utils/axiosInstance";

const RESOURCE = "/properties";
const CLIENT_RESOURCE = "/api/client/properties";

export const getAllProperties = async (): Promise<Property[]> => {
    const res = await httpClient.get(RESOURCE);
    return res.data?.data?.data || [];
};

export const getMyProperties = async (): Promise<Property[]> => {
    try {
        const api = createAxiosInstance();
        console.log("🔍 Fetching user properties from:", `${api.defaults.baseURL}${CLIENT_RESOURCE}`);
        const res = await api.get(CLIENT_RESOURCE);
        
        console.log("✅ Response:", res.data);
        
        if (res.data?.data) {
            return Array.isArray(res.data.data) ? res.data.data : [];
        } else if (res.data?.properties) {
            return Array.isArray(res.data.properties) ? res.data.properties : [];
        } else if (Array.isArray(res.data)) {
            return res.data;
        }
        
        return [];
    } catch (error: any) {
        console.error("❌ Error fetching user properties:", {
            message: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            url: error.config?.url,
        });
        
        if (error.response?.status === 404 || error.response?.status === 501) {
            console.warn("⚠️ Backend API chưa implement GET /api/client/properties");
            return [];
        }
        
        throw error;
    }
};

export const getPropertyById = async (id: string): Promise<Property> => {
    const res = await httpClient.get(`${RESOURCE}/${id}`);
    return res.data?.data;
};

export const updateProperty = async (
    id: string,
    data: FormData
): Promise<Property> => {
    const api = createAxiosInstance();
    const res = await api.patch(`${CLIENT_RESOURCE}/${id}`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data?.data;
};

export const deleteProperty = async (id: string): Promise<void> => {
    const api = createAxiosInstance();
    await api.delete(`${CLIENT_RESOURCE}/${id}`);
};