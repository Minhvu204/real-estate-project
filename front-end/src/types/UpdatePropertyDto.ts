export type UpdatePropertyDto = {
    title?: string;
    description?: string;
    price?: number;
    city_id?: string;
    type_id?: string;
    category_id?: string;
    features?: string[];
    images?: File[] | string[]; // Files mới hoặc URLs cũ
    address?: string;
    bedrooms?: number;
    bathrooms?: number;
    area?: number;
    unit?: string;
    yearBuilt?: number;
    floors?: number;
};

