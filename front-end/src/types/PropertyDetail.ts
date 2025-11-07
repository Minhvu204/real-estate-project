export interface PropertyDetail {
    id: string;
    title: { en: string; vi: string };
    description: { en: string; vi: string };
    price: number;
    address: { en: string; vi: string };
    bedrooms: number;
    bathrooms: number;
    area: number;
    unit: string;
    yearBuilt: number;
    floors: number;
    coordinates?: { lat: number; lng: number };
    city?: { _id: string; city_name: { en: string; vi: string } };
    category?: { _id: string; category_name: { en: string; vi: string } };
    type?: { _id: string; type_name: { en: string; vi: string } };
    features: { _id: string; feature_name: { en: string; vi: string } }[];
    images: string[];
    owner?: { _id: string; fullName: string; email: string; phone: string };
    agent?: {
        _id: string;
        fullName: string;
        email: string;
        phone: string;
        avatar?: string;
    };
    status: string;
    createdAt: string;
    updatedAt: string;
}
