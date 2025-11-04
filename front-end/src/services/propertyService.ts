import type { Property } from "../types/Property";
import { httpPublic } from "../utils/httpPublic";
import { httpClient } from "../utils/httpClient";
import type { User } from "../types/Users";
const RESOURCE = "/properties";

export const getAllProperties = async (): Promise<Property[]> => {
    const res = await httpPublic.get(`${RESOURCE}?populate=type_id,category_id,city_id`);
    return res.data.data.data;
}
export const getPropertiesByAgentOrSeller = async (u: User): Promise<Property[]> => {
    const RESOURCE = `${u.role}/properties`;
    const response = await httpClient.get(`${u.role}/${RESOURCE}`);
    return response.data.data.data;
}
export const getPropertiesById = async (id: string): Promise<Property> => {
    const response = await httpClient.get(`${RESOURCE}/${id}`);
    return response.data.data;
}
