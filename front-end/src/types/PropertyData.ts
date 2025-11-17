type common = number | string;
export type PropertyData = {
    title: string;
    price: common;
    description: string;
    address: string;
    bathrooms: common;
    bedrooms: common;
    area: common;
    unit: common;
    floors: common;
    yearBuilt?: common;
    city_id: string;
    district_id: string;
    ward_id: string;
    category_id: string;
    type_id: string;
    coordinates?: {
        type: "Point";
        coordinates: [number, number];
    };
    floor_number?: string;
    building_block?: string;
    apartment_number?: string;
}
