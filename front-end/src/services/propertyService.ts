import type { Property, DetailProperty } from "../types/Property";
import { httpPublic } from "../utils/httpPublic";
import { httpClient } from "../utils/httpClient";
import type { PropertyListData } from "../types/Respondata";
import { httpAdmin } from "../utils/httpAdmin";

const RESOURCE = "/properties";

export const getAllProperties = async (): Promise<Property[]> => {
  const res = await httpAdmin.get(RESOURCE);
  return res.data.data.data;
};
export const getAllPropertiesByUser = async (): Promise<Property[]> => {
  const res = await httpPublic.get(`${RESOURCE}?populate=type_id,category_id,city_id`);
  return res.data.data.data;
}
export const getAllPropertiesPublic = async (): Promise<Property[]> => {
  const res = await httpPublic.get(`${RESOURCE}`);
  return res.data.data.data;
}
export const getPropertiesByAgentOrSeller = async (): Promise<PropertyListData> => {
  const response = await httpClient.get(RESOURCE);
  return response.data.data;
}
export const getPropertiesById = async (id: string): Promise<Property> => {
  const response = await httpClient.get(`${RESOURCE}/${id}`);
  return response.data.data;
};

export const getDetailPropertiesById = async (
  id: string
): Promise<DetailProperty> => {
  const response = await httpPublic.get(`${RESOURCE}/${id}`);
  return response?.data?.data;
};

export const hideProperty = async (
  id: string,
  note?: string
): Promise<DetailProperty> => {
  try {
    const res = await httpAdmin.patch(`${RESOURCE}/${id}/hide`, { note });
    return res?.data?.data;
  } catch (error: any) {
    console.log("lỗi khi hide property:", error);
    throw new Error(error.response?.data?.message || "hide property thất bại");
  }
};

export const restoreProperty = async (id: string): Promise<DetailProperty> => {
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

