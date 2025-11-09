import type { Property } from "../types/Property";
import { httpPublic } from "../utils/httpPublic";
import { httpClient } from "../utils/httpClient";
import type { PropertyListData } from "../types/Respondata";

import type { Feature } from "@/types/Feature";
import type { Taxonomy } from "@/types/Taxonomy";
const RESOURCE = "/properties";
const SELLER_RESOURCE = "/seller";
export const getAllProperties = async (): Promise<Property[]> => {
    const res = await httpPublic.get(`${RESOURCE}?populate=type_id,category_id,city_id`);
    return res.data.data.data;
}
export const getPropertiesByAgentOrSeller = async (): Promise<PropertyListData> => {
    const response = await httpClient.get(RESOURCE);
    return response.data.data;
}
export const getPropertiesById = async (id: string): Promise<Property> => {
    const response = await httpClient.get(`${RESOURCE}/${id}`);
    return response.data.data.data;
}   

export const getAllFeatures = async (): Promise<Feature[]> => {
    const response = await httpClient.get(`${SELLER_RESOURCE}/taxonomies`);
    return response.data.data.features;
}

export const getAllTaxonomies = async (): Promise<Taxonomy> => {
    const response = await httpClient.get(`${SELLER_RESOURCE}/taxonomies`);
    return response.data.data;
}

export const createProperty = async (
    propertyData: any,
    images: File[]
): Promise<Property> => {
    const formData = new FormData();
    formData.append('title', propertyData.title);
    formData.append('description', propertyData.description || '');
    formData.append('address', propertyData.address);
    formData.append('price', propertyData.price.toString());
    formData.append('bedrooms', propertyData.bedrooms?.toString() || '0');
    formData.append('bathrooms', propertyData.bathrooms?.toString() || '0');
    formData.append('area', propertyData.area.toString());
    formData.append('unit', propertyData.unit || 'm2');
    formData.append('floors', propertyData.floors?.toString() || '1');
    if (propertyData.yearBuilt) {
        formData.append('yearBuilt', propertyData.yearBuilt.toString());
    }
    formData.append('city_id', propertyData.city_id);
    formData.append('category_id', propertyData.category_id);
    formData.append('type_id', propertyData.type_id);
    if (propertyData.coordinates?.lat && propertyData.coordinates?.lng) {
        formData.append('coordinates[lat]', propertyData.coordinates.lat.toString());
        formData.append('coordinates[lng]', propertyData.coordinates.lng.toString());
    }
    if (propertyData.features && Array.isArray(propertyData.features)) {
        propertyData.features.forEach((featureId: string) => {
            formData.append('features[]', featureId);
        });
    }
    images.forEach((file, index) => {
        if (index < 10) {
            formData.append('images', file);
        }
    });
    const response = await httpClient.post(`${SELLER_RESOURCE}/properties/create`, formData,);

    return response.data.data;
};