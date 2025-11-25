export type Favorite = {
    _id: string,
    user_id: string,
    property_id: string,
    createAt: string,
    updateAt: string,
    __v: number,
}

export type checkFavoriteType = {
    isFavorite: boolean,
    favorite: Favorite
}

export type PropertyFavorite = {
    favorite_id: string;
    property_id: string;
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
        type: "Point",
        coordinates: [number, number]
    };
    city: {
        vi: string;
        en: string;
    };
    district: {
        vi: string;
        en: string;
    };
    ward: {
        vi: string;
        en: string;
    };
    type: {
        vi: string;
        en: string;
    };
    category: {
        vi: string;
        en: string;
    };
    owner?: {
        _id: string;
        fullName: string;
        email: string;
        phone?: string;
        avatar?: string;
    };
    agent?: {
        _id: string;
        fullName: string;
        email: string;
        phone?: string;
        avatar?: string;
    };
    feature_name: {
        vi: string;
        en: string;
    }[];
    images: string[];
    status: string;
    createdAt: string;
    updatedAt: string;
}