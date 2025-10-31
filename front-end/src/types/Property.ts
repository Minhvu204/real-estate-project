export type Property = {
    _id: string;
    title: string;
    description?: string;
    price: number;
    address: string;
    bedrooms: number;
    bathrooms: number;
    city_id?: {
        _id: string;
        city_name: string;
    };
    type_id?: {
        _id: string;
        type_name: string;
    };
    category_id?: {
        _id: string;
        category_name: string;
    };
    owner_id?: {
        _id: string;
        fullName: string;
        email: string;
    };
    agent_id?: {
        _id: string;
        fullName: string;
        email: string;
    };
    features?: {
        _id: string;
        feature_name: string;
    }[];
    images: string[];
    status: string;
    deleted: boolean;
    coordinates: {
        lat: number;
        lng: number;
    };
    createdAt: string;
    updatedAt: string;
}
