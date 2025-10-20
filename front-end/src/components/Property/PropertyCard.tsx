import React, { useState } from "react";
import type { Property } from "../../types/Property";

type PropertyCardProps = {
    property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
    const [currIndex, setCurrIndex] = useState(0);


}