export type Taxonomy = {
    cities: [
        {
            city_name: {
                vi: string,
                en: string
            }
            _id: string
        }
    ]
    propertyTypes: [
        {
            type_name: {
                vi: string;
                en: string
            };
            _id: string
        }
    ]
    categories: [
        {
            category_name: {
                vi: string;
                en: string
            };
            _id: string
        }
    ]
    features: [
        {
            feature_name: {
                vi: string;
                en: string
            };
            _id: string
        }
    ]
}
// Song ngữ
export interface LocalizedName {
    vi: string;
    en: string;
}

// === CITY ===
export interface City {
    _id: string;
    city_name: LocalizedName;
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface CityResponse {
    success: true;
    message: string;
    data: City[];
}

// === FEATURE ===
export interface Feature {
    _id: string;
    feature_name: LocalizedName;
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface FeatureResponse {
    success: true;
    message: string;
    data: Feature[];
}

// === TYPE ===
export interface TypeItem {
    _id: string;
    type_name: LocalizedName;
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface TypeResponse {
    success: true;
    message: string;
    data: TypeItem[];
}

// === CATEGORY ===
export interface Category {
    _id: string;
    category_name: LocalizedName;
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface CategoryResponse {
    success: true;
    message: string;
    data: Category[];
}

export type TaxonomyItem = City | Feature | TypeItem | Category;
export type TaxonomyType = "cities" | "features" | "types" | "categories";