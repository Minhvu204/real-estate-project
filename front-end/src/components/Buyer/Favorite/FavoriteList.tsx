import type { PropertyFavorite } from '@/types/FavoriteType'
import PropertyCardFavorite from './PropertyCardFavorite'
import { useEffect, useState } from 'react'
import { deletePropertyFavorite } from '@/services/buyerService'
import CompareBar from './CompareBar'

type Properties = {
    properties: PropertyFavorite[]
}
type pendingDelete = {
    property: PropertyFavorite
    timerId: ReturnType<typeof setTimeout>;
}

const FavoriteList = ({ properties }: Properties) => {
    const [propertiesList, setPropertiesList] = useState<PropertyFavorite[]>(properties)
    const [pendingDeletes, setPendingDeletes] = useState<pendingDelete[]>([]);
    const [compareList, setCompareList] = useState<PropertyFavorite[]>([]);
    const handleRemoveFavorite = (property: PropertyFavorite) => {
        setPropertiesList(prev => prev.filter(p => p.property_id !== property.property_id));
        const timerId = setTimeout(async () => {
            try {
                await deletePropertyFavorite(property.property_id);
            } catch (error) {
                console.log(error);
            } finally {
                setPendingDeletes(prev => prev.filter(p => p.property.property_id !== property.property_id));
            }
        }, 10000)
        setPendingDeletes(prev => [...prev, { property, timerId }]);
    }

    const handleUndo = (propertyId: string) => {
        const item = pendingDeletes.find(p => p.property.property_id === propertyId);
        if (!item) return;
        clearTimeout(item.timerId);
        setPropertiesList(prev => [...prev, item.property]);
        setPendingDeletes(() => pendingDeletes.filter(p => p.property.property_id !== propertyId))
    }
    const handleClose = (id: string) => {
        setPendingDeletes(prev => prev.filter(pd => pd.property.property_id !== id));
    };
    useEffect(() => {
        setPropertiesList(properties);
    }, [properties]);
    const toggleCompare = (property: PropertyFavorite) => {
        setCompareList(prev => {
            const exists = prev.find(p => p.property_id === property.property_id);
            if (exists) return prev.filter(p => p.property_id !== property.property_id);
            if (prev.length >= 5) {
                alert("Maximum 5 properties for comparison.");
                return prev;
            }
            return [...prev, property];
        });
    };
    return (
        <div className='m-4'>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {propertiesList.map((property: PropertyFavorite) => (
                    <PropertyCardFavorite
                        key={property.property_id}
                        property={property}
                        onRemoveFavorite={handleRemoveFavorite}
                        onToggleCompare={() => toggleCompare(property)}
                        isCompared={compareList.some(p => p.property_id === property.property_id)}
                    />
                ))}
            </div>
            <CompareBar
                compareList={compareList}
                removeFromCompare={(id) =>
                    setCompareList(prev => prev.filter(p => p.property_id !== id))
                }
            />
            <div className="fixed bottom-4 right-4 space-y-2">
                {pendingDeletes.map(pd => (
                    <div
                        key={pd.property.property_id}
                        className="bg-gray-800 text-white p-2 rounded shadow flex justify-between items-center"
                    >
                        <span>Removed {pd.property.title.en}</span>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => handleUndo(pd.property.property_id)}
                                className="px-2 py-1 bg-blue-600 rounded hover:bg-blue-700 cursor-pointer"
                            >
                                Undo
                            </button>
                            <button
                                onClick={() => handleClose(pd.property.property_id)}
                                className="px-2 py-1 bg-gray-600 rounded hover:bg-gray-700"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default FavoriteList
