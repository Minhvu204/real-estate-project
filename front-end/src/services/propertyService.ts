import type { DetailProperty, Property } from "../types/Property";
import { httpClient } from "../utils/httpClient";
const RESOURCE = "/properties";

export const getAllProperties = async (): Promise<Property[]> => {
  const res = await httpClient.get(RESOURCE);
  return res.data?.data?.data || [];
};

export const getPropertiesById = async (id: string): Promise<DetailProperty> => {
  const res = await httpClient.get(`${RESOURCE}/${id}`);
  return res.data?.data || [];
};
