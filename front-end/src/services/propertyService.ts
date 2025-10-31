import type { Property } from "../types/Property";
import { httpPublic } from "../utils/httpPublic";
import { httpClient } from "../utils/httpClient";
import type { User } from "../types/Users";


export const getAllProperties = async (): Promise<Property[]> => {
    const RESOURCE = "/properties";
    const res = await httpPublic.get(RESOURCE);
    return res.data.data.data;
}
export const getPropertiesByAgentOrSeller = async (u: User): Promise<Property[]> => {
    const RESOURCE = `${u.role}/properties`;
    const response = await httpClient.get(RESOURCE);
    return response.data.data.data;
}