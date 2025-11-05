import type { Property } from "../types/Property";
import { httpPublic } from "../utils/httpPublic";
import { createAxiosInstance } from "../utils/axiosInstance";

import { httpClient } from "../utils/httpClient";
import type { User } from "../types/Users";
const RESOURCE = "/properties";

export const getAllProperties = async (): Promise<Property[]> => {
    const res = await httpPublic.get(RESOURCE);
    return res.data.data.data; 
};


export const getPropertiesByAgentOrSeller = async (u: User): Promise<Property[]> => {
    const RESOURCE = `${u.role}/properties`;
    const response = await httpClient.get(RESOURCE);
    return response.data.data.data; 
};

export const getPropertyById = async (id: string): Promise<Property> => {
    const RESOURCE = `/properties/${id}`;
    const res = await httpClient.get(RESOURCE);
    return res.data?.data; 
};


export const getMyProperties = async (): Promise<Property[]> => {
    try {
        const api = createAxiosInstance();
        const RESOURCE = "/api/client/properties";
        const res = await api.get(RESOURCE);

        if (res.data?.data) {
            return Array.isArray(res.data.data) ? res.data.data : [];
        } else if (res.data?.properties) {
            return Array.isArray(res.data.properties) ? res.data.properties : [];
        } else if (Array.isArray(res.data)) {
            return res.data;
        }

        return [];
    } catch (error: any) {
        if (error.response?.status === 404 || error.response?.status === 501) {
            return [];
        }
        throw error;
    }
};

export const updateProperty = async (id: string, data: FormData): Promise<Property> => {
    const api = createAxiosInstance();
    const RESOURCE = `/api/client/properties/${id}`;
    const res = await api.patch(RESOURCE, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data?.data; 
};

export const deleteProperty = async (id: string): Promise<void> => {
    const api = createAxiosInstance();
    const RESOURCE = `/api/client/properties/${id}`;
    await api.delete(RESOURCE);
};
