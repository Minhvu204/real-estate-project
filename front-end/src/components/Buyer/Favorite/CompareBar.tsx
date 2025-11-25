import type { PropertyFavorite } from '@/types/FavoriteType'
import React from 'react'

type CompareBarProps = {
    compareList: PropertyFavorite[],
    removeFromCompare: (propertyId: string) => void
}

const CompareBar: React.FC<CompareBarProps> = ({ compareList, removeFromCompare }) => {

    const handleCompare = () => {
        if (compareList.length < 2 || compareList.length > 5) {
            alert("select at least 2 and at most 5 properties to compare");
        }
        const ids = compareList.map(p => p.property_id).join(",");
    }
    if (compareList.length === 0) return null;
    return (
        <div className='fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t p-2 flex items-center overflow-x-auto space-x-4 z-50'>
            {compareList.map((property) => (
                <div key={property.property_id} className="flex items-center space-x-2 bg-gray-100 p-1 rounded relative ">
                    <img
                        src={property.images[0]}
                        alt={property.title.en}
                        className="w-16 h-16 object-cover rounded"
                    />
                    <button
                        onClick={() => removeFromCompare(property.property_id)}
                        className="text-red-500 font-bold px-1 absolute bottom-14 left-18 cursor-pointer text-xl"
                    >
                        ×
                    </button>
                </div>
            ))}
            <button
                onClick={handleCompare}
                className="ml-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Compare
            </button>
        </div>
    )
}

export default CompareBar
