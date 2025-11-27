import PropertiesCompare from '@/components/Buyer/Compare/PropertiesCompare';
import { getPropertyByIds } from '@/services/buyerService';
import type { PropertyCompare } from '@/types/FavoriteType';
import { getLanguage, type Lang } from '@/utils/storage';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

type PropertiesComparePageProps = {
    properties: PropertyCompare[]
}

const PropertiesComparePage: React.FC<PropertiesComparePageProps> = () => {
    const [properties, setProperties] = useState<PropertyCompare[]>([]);
    const { ids } = useParams<{ ids: string }>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const currentLanguage: Lang = getLanguage();
    useEffect(() => {
        if (!ids) return;
        setLoading(true);
        const fetchProperties = async () => {
            try {
                const data = await getPropertyByIds(ids);
                setProperties(data);
                console.log(data);
            } catch (error: any) {
                console.log(error);
                setError(error.message)
            } finally {
                setLoading(false);
            }
        };
        fetchProperties();
    }, [ids, currentLanguage]);
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
                    <span className="ml-3 text-gray-600">loading...</span>
                </div>
            ) : (
                <div>
                    <h1 className='text-3xl m-4 font-bold text-blue-600'>
                        Properties Compare
                    </h1>
                    <PropertiesCompare properties={properties} />
                </div>
            )}
        </div>
    )
}

export default PropertiesComparePage;