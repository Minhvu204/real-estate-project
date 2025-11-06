import React, { useState, useEffect } from 'react'
import { getAllFeatures } from '@/services/propertyService';
import type { Feature } from '@/types/Feature';
import { getLanguage, type Lang } from '@/utils/storage';

interface SelectFeaturesProps {
    selectedFeatures: string[];
    onSubmit: (features: string[]) => void;
    onBack: () => void;
}

const SelectFeatures: React.FC<SelectFeaturesProps> = ({ selectedFeatures, onSubmit, onBack }) => {
    const [features, setFeatures] = useState<string[]>(selectedFeatures);
    const [availableFeatures, setAvailableFeatures] = useState<Feature[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const currentLanguage: Lang = getLanguage();
    useEffect(() => {
        const fetchFeatures = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getAllFeatures();
                setAvailableFeatures(data);
            } catch (err) {
                console.error('Error fetching features:', err);
                setError('Không thể tải danh sách tiện ích. Vui lòng thử lại!');
            } finally {
                setLoading(false);
            }
        };
        fetchFeatures();
    }, []);

    const toggleFeature = (featureId: string) => {
        if (features.includes(featureId)) {
            setFeatures(features.filter(f => f !== featureId));
        } else {
            setFeatures([...features, featureId]);
        }
    };

    const handleSubmit = () => {
        onSubmit(features);
    };

    return (
        <div className='bg-white shadow-md rounded-2xl p-6 space-y-5 flex flex-col justify-center'>
            <h1 className='text-center text-3xl font-semibold text-blue-600 mb-4'>
                Chọn tiện ích bất động sản
            </h1>
            {error && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <span className="text-yellow-400">⚠️</span>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            <div>
                <p className='text-lg font-semibold mb-2'>Chọn tiện ích bất động sản (nhấn để chọn)</p>
                <p className='text-sm text-gray-600 mb-4'>Đã chọn: {features.length} tiện ích</p>
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <span className="ml-3 text-gray-600">Đang tải tiện ích...</span>
                    </div>
                ) : (
                    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mt-4'>
                        {availableFeatures.map((feature) => (
                            <button
                                key={feature._id}
                                type='button'
                                onClick={() => toggleFeature(feature._id)}
                                className={`border-2 rounded-2xl cursor-pointer w-full h-24 flex flex-col items-center justify-center transition-all hover:scale-105 ${features.includes(feature._id)
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300'
                                    }`}
                            >
                                <span className='text-3xl mb-1'>icon</span>
                                <span className='text-xs font-medium text-center px-1'>{feature.feature_name[currentLanguage]}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <div className="pt-4 flex justify-between">
                <button
                    type="button"
                    onClick={onBack}
                    className="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300"
                >
                    Quay lại
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`font-semibold px-6 py-2 rounded-lg transition-all duration-300 ${loading
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                >
                    Tiếp tục
                </button>
            </div>
        </div>
    )
}

export default SelectFeatures;
