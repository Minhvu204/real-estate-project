import type { Property } from "../types/Property";
import { httpClient } from "@/utils/httpClient";
const RESOURCE = "properties";

export const getAllProperties = async (): Promise<Property[]> => {
    const res = await httpClient.get(RESOURCE);
    return res.data.data.data;
}