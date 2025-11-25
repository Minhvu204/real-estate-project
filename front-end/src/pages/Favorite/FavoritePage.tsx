import FavoriteList from '@/components/Buyer/Favorite/FavoriteList';
import NavFavorite from '@/components/Buyer/Favorite/NavFavorite';
import useTitle from '@/hooks/useTitle';
import { getAllFavoriteProperties } from '@/services/buyerService';
import type { PropertyFavorite } from '@/types/FavoriteType';
import { useEffect, useState } from 'react'

const FavoritePage = () => {
    const [properties, setProperties] = useState<PropertyFavorite[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [propertiesFiltered, setPropertiesFiltered] = useState<PropertyFavorite[]>([]);
    useTitle('Dwello | My Favorite Homes');
    useEffect(() => {
        const fetchProperties = async () => {
            setLoading(true);
            try {
                const data = await getAllFavoriteProperties();
                setProperties(data);
                setPropertiesFiltered(data);
            } catch (error: any) {
                setError(error.message || 'Error fetching properties');
            } finally {
                setLoading(false);
            }
        };
        fetchProperties();
    }, []);
    return (
        <div>
            {error && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                    <p className="text-sm text-yellow-700">{error}</p>
                </div>
            )}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Loading...</span>
                </div>
            ) : (
                <div>
                    <p className='text-4xl font-bold m-5 text-blue-500'>Save Homes</p>
                    <NavFavorite properties={properties} propertiesFiltered={propertiesFiltered} setPropertiesFiltered={setPropertiesFiltered} />
                    <FavoriteList properties={propertiesFiltered} />
                </div>
            )}
        </div>
    )
}

export default FavoritePage;