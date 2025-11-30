import PropertyCard from '@/components/Property/PropertyCard'
import type { Property } from '@/types/Property'
import React from 'react'

type Properties = {
    properties: Property[]
}

const FavoriteList = ({ properties }: Properties) => {
    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {properties.map((property: Property) => (
                    <PropertyCard key={property._id} property={property} />
                ))}
            </div>
        </div>
    )
}

export default FavoriteList
