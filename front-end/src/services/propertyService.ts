import type { Property } from "../types/Property";
import { httpPublic } from "../utils/httpPublic";
import { httpClient } from "../utils/httpClient";
import type { User } from "../types/Users";
import { httpAdmin } from "../utils/httpAdmin";
const RESOURCE = "/properties";

export const getAllProperties = async (): Promise<Property[]> => {
  const res = await httpAdmin.get(RESOURCE, {
    params: { limit: 100 },
  });
  return res.data.data.data;
};

export const getAllPropertiesByPending = async (): Promise<Property[]> => {
  const res = await httpAdmin.get(`${RESOURCE}?status=pending`, {
    params: { limit: 100 },
  });
  return res.data.data.data;
};

export const getPropertiesByAgentOrSeller = async (
  u: User
): Promise<Property[]> => {
  const RESOURCE = `${u.role}/properties`;
  const response = await httpClient.get(`${u.role}/${RESOURCE}`);
  return response.data.data.data;
};
export const getPropertiesById = async (id: string): Promise<Property> => {
  const response = await httpClient.get(`${RESOURCE}/${id}`);
  return response.data.data;
};

export const getDetailPropertiesById = async (
  id: string
): Promise<Property> => {
  const response = await httpPublic.get(`${RESOURCE}/${id}`);
  return response?.data?.data?.data;
};

export const hideProperty = async (
  id: string,
  note?: string
): Promise<Property> => {
  try {
    const res = await httpAdmin.patch(`${RESOURCE}/${id}/hide`, { note });
    return res?.data?.data;
  } catch (error: any) {
    console.log("lỗi khi hide property:", error);
    throw new Error(error.response?.data?.message || "hide property thất bại");
  }
};

export const restoreProperty = async (id: string): Promise<Property> => {
  try {
    const res = await httpAdmin.patch(`${RESOURCE}/${id}/restore`);
    return res?.data?.data;
  } catch (error: any) {
    console.log("lỗi khi restore property:", error);
    throw new Error(
      error.response?.data?.message || "restore property thất bại"
    );
  }
};

export const updateStatus = async (
  id: string,
  status: string
): Promise<Property> => {
  try {
    const res = await httpAdmin.patch(`${RESOURCE}/${id}/status`, { status });
    return res?.data?.data;
  } catch (error: any) {
    console.log("lỗi khi update status property:", error);
    throw new Error(
      error.response?.data?.message || "update status property thất bại"
    );
  }
};
