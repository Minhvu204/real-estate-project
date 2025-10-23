import React, { useState } from "react";
import type { Property } from "../../types/Property";
import Carousel from "./Carousel";
type PropertyCardProps = {
    property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
    return (
        <div className="bg-white rounded-md shadow hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="w-full aspect-[4/3] bg-gray-100">
                <Carousel>
                    {property.imageUrls.map((imageUrl, index) => (
                        <img
                            key={index}
                            src={imageUrl}
                            alt={`Ảnh bất động sản ${index + 1}`}
                            className="w-full h-full object-contain rounded-none"
                        />
                    ))}
                </Carousel>
            </div>
            <div className="p-3 space-y-1">
                <h3 className="font-semibold text-gray-900 text-sm md:text-base line-clamp-1">
                    {property.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-1">{property.address}</p>
                <p className="text-blue-600 font-bold text-sm">
                    {property.price >= 1_000_000_000
                        ? `${(property.price / 1_000_000_000).toFixed(1)} Tỷ`
                        : `${(property.price / 1_000_000).toFixed(0)} Triệu`}
                </p>
                <p className="text-xs text-gray-600">
                    {property.bedrooms} phòng ngủ · {property.bathrooms} phòng tắm
                </p>
            </div>
        </div>
    );
}

export default PropertyCard;