import PropertyCard from '../../components/property/PropertyCard';
import PropertyMap from "../../components/property/PropertyMap";
import { MOCK_PROPERTIES } from '../../data/mockProperties';
import type { Property } from '../../types/Property';
const SearchPage = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 h-[90vh]">
            <div className="h-full">
                <PropertyMap properties={MOCK_PROPERTIES} />
            </div>
            <div className="overflow-y-auto max-h-[90vh] p-3">
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    {MOCK_PROPERTIES.map((property: Property) => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SearchPage;
