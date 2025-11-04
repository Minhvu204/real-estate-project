import { createAxiosInstance } from "../utils/axiosInstance";
import type { City } from "../types/Cities";
import type { PropertyType } from "../types/PropertyTypes";
import type { Feature } from "../types/Features";

const extractUniqueCities = (properties: any[]): City[] => {
    const cityMap = new Map<string, City>();
    properties.forEach(prop => {
        const city = prop.city_id || prop.city;
        if (city && city._id && city.city_name) {
            cityMap.set(city._id, {
                _id: city._id,
                city_name: city.city_name,
            });
        }
    });
    return Array.from(cityMap.values());
};

const extractUniqueTypes = (properties: any[]): PropertyType[] => {
    const typeMap = new Map<string, PropertyType>();
    properties.forEach(prop => {
        const type = prop.type_id || prop.propertyType;
        if (type && type._id && type.type_name) {
            typeMap.set(type._id, {
                _id: type._id,
                type_name: type.type_name,
            });
        }
    });
    return Array.from(typeMap.values());
};

const extractUniqueFeatures = (properties: any[]): Feature[] => {
    const featureMap = new Map<string, Feature>();
    properties.forEach(prop => {
        if (Array.isArray(prop.features)) {
            prop.features.forEach((feature: any) => {
                if (feature && feature._id && feature.feature_name) {
                    featureMap.set(feature._id, {
                        _id: feature._id,
                        feature_name: feature.feature_name,
                    });
                }
            });
        }
    });
    return Array.from(featureMap.values());
};

export const cityService = {
    getAll: async (): Promise<City[]> => {
        try {
            const api = createAxiosInstance();
            const response = await api.get("/api/public/properties");
            
            let properties = [];
            if (response.data?.data) {
                properties = Array.isArray(response.data.data) ? response.data.data : [];
            } else if (response.data?.properties) {
                properties = Array.isArray(response.data.properties) ? response.data.properties : [];
            } else if (Array.isArray(response.data)) {
                properties = response.data;
            }
            
            return extractUniqueCities(properties);
        } catch (error) {
            return [];
        }
    },
};

export const propertyTypeService = {
    getAll: async (): Promise<PropertyType[]> => {
        try {
            const api = createAxiosInstance();
            const response = await api.get("/api/public/properties");
            
            let properties = [];
            if (response.data?.data) {
                properties = Array.isArray(response.data.data) ? response.data.data : [];
            } else if (response.data?.properties) {
                properties = Array.isArray(response.data.properties) ? response.data.properties : [];
            } else if (Array.isArray(response.data)) {
                properties = response.data;
            }
            
            return extractUniqueTypes(properties);
        } catch (error) {
            return [];
        }
    },
};

export const featureService = {
    getAll: async (): Promise<Feature[]> => {
        try {
            const api = createAxiosInstance();
            const response = await api.get("/api/public/properties");
            
            let properties = [];
            if (response.data?.data) {
                properties = Array.isArray(response.data.data) ? response.data.data : [];
            } else if (response.data?.properties) {
                properties = Array.isArray(response.data.properties) ? response.data.properties : [];
            } else if (Array.isArray(response.data)) {
                properties = response.data;
            }
            
            return extractUniqueFeatures(properties);
        } catch (error) {
            return [];
        }
    },
};

