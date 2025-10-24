import React, { useState } from "react";
import type { Property } from "../../types/Property";
import Carousel from "./Carousel";
type PropertyCardProps = {
    property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
    return (
        <div className="bg-white rounded-md shadow hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="aspect-[4/3] w-full relative">
                <Carousel>
                    {property.images.map((imageUrl, index) => (
                        <img
                            key={index}
                            src={imageUrl}
                            alt={`Ảnh ${index + 1}`}
                            className="w-full h-full object-cover"
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
                    {property.price >= 1_000_000
                        ? `$${(property.price / 1_000_000).toFixed(1)}M`
                        : property.price >= 1_000 ? `$${(property.price / 1_000).toFixed(1)}K` : `$${property.price}`}
                </p>
                <p className="text-xs text-gray-600">
                    {property.bedrooms} phòng ngủ · {property.bathrooms} phòng tắm
                </p>
            </div>
        </div>
    );
}

export default PropertyCard;