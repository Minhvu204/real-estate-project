export type Property = {
    id: string;
    title: string;
    address: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    imageUrls: string[];
    coordinates: {
        lat: number;
        lng: number;
    }
}