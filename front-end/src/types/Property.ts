export type Property = {
    _id: string;
    title: {
        vi: string;
        en: string;
    };
    description: {
        vi: string;
        en: string;
    };
    price: number;
    address: {
        vi: string;
        en: string;
    };
    bedrooms: number;
    bathrooms: number;
    area?: number;
    unit?: string;
    yearBuilt?: number;
    floors?: number;
    coordinates?: {
        lat: number;
        lng: number;
    };
    city_id?: {
        _id: string;
        city_name: {
            vi: string;
            en: string;
        };
    };
    type_id?: {
        _id: string;
        type_name: {
            vi: string;
            en: string;
        };
    };
    category_id?: {
        _id: string;
        category_name: {
            vi: string;
            en: string;
        };
    };
    owner_id?: {
        _id: string;
        fullName: string;
        email: string;
        phone?: string;
    };
    agent_id?: {
        _id: string;
        fullName: string;
        email: string;
        phone?: string;
    };
    features?: {
        _id: string;
        feature_name: {
            vi: string;
            en: string;
        };
    }[];
    images: string[];
    status: string;
    deleted: boolean;
    assignmentHistory: any[];
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
    reviewedAt?: string;
    reviewedBy?: string;
};