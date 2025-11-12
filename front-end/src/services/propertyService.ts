import type { Property, DetailProperty } from "../types/Property";
import { httpPublic } from "../utils/httpPublic";
import { createAxiosInstance } from "../utils/axiosInstance";
import { httpClient } from "../utils/httpClient";
import type { User } from "../types/Users";
import type { Feature } from "@/types/Feature";
import type { Taxonomy } from "@/types/Taxonomy";
import { httpAdmin } from "../utils/httpAdmin";
const RESOURCE = "/properties";
const SELLER_RESOURCE = "/seller";
export const getAllProperties = async (): Promise<Property[]> => {
    const res = await httpPublic.get(`${RESOURCE}?populate=type_id,category_id,city_id`);
    return res.data.data.data;
}
export const getPropertiesByAgentOrSeller = async (): Promise<Property[]> => {
    const response = await httpClient.get(RESOURCE);
    return response.data.data.data;
}
export const getPropertiesById = async (id: string): Promise<Property> => {
    const response = await httpClient.get(`${RESOURCE}/${id}`);
    return response.data.data;
}

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

export const getDetailPropertiesById = async (
  id: string
): Promise<Property> => {
  try {
    const response = await httpPublic.get(`${RESOURCE}/${id}`);
    console.log("API Response:", response.data);
    const propertyData = response?.data?.data?.data || response?.data?.data;
    console.log("Property data extracted:", propertyData);
    return propertyData;
  } catch (error: any) {
    console.error("Error in getDetailPropertiesById:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
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



