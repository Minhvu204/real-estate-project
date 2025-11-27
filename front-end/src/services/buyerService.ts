import type { checkFavoriteType, PropertyCompare, PropertyFavorite, } from "@/types/FavoriteType";
import { httpClient } from "@/utils/httpClient";

const BUYER_RESOURCE = "/buyer";

export const getAllFavoriteProperties = async (): Promise<PropertyFavorite[]> => {
    const response = await httpClient.get(`${BUYER_RESOURCE}/favorites`);
    return response.data.data.data.data;
}

export const checkPropertyFavorite = async (id: string): Promise<checkFavoriteType> => {
    const response = await httpClient.get(`${BUYER_RESOURCE}/favorites/${id}/check`);
    return response.data.data;
}

export const deletePropertyFavorite = async (property_id: string): Promise<void> => {
    const response = await httpClient.delete(`${BUYER_RESOURCE}/favorites/${property_id}`);
    return response.data.data;
}

export const addPropertyFavorite = async (property_id: string): Promise<void> => {
    const response = await httpClient.post(`${BUYER_RESOURCE}/favorites`, { property_id });
    return response.data.data;
}

export const getPropertyByIds = async (ids: string): Promise<PropertyCompare[]> => {
    const response = await httpClient.get(`${BUYER_RESOURCE}/properties/by-ids?ids=${ids}`);
    return response.data.data;
}