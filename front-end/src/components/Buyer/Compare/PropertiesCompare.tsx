import type { PropertyCompare } from '@/types/FavoriteType'
import { getLanguage, type Lang } from '@/utils/storage';
import React from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

type PropertiesComparePageProps = {
    properties: PropertyCompare[];
}
const PropertiesCompare: React.FC<PropertiesComparePageProps> = ({ properties }) => {
    const currentLanguage: Lang = getLanguage();
    const { t } = useTranslation(['favorite']);
    const navigate = useNavigate();
    const fields = [
        { label: t('favorite:compareFields.status'), value: (p: PropertyCompare) => p.type_id.type_name[currentLanguage] },
        { label: t('favorite:compareFields.price'), value: (p: PropertyCompare) => p.price },
        { label: t('favorite:compareFields.bedrooms'), value: (p: PropertyCompare) => p.bedrooms },
        { label: t('favorite:compareFields.bathrooms'), value: (p: PropertyCompare) => p.bathrooms },
        { label: t('favorite:compareFields.square'), value: (p: PropertyCompare) => p.area ?? "-" },
        { label: t('favorite:compareFields.homeType'), value: (p: PropertyCompare) => p.category_id.category_name[currentLanguage] },
        { label: t('favorite:compareFields.yearBuilt'), value: (p: PropertyCompare) => p.yearBuilt ?? "-" },
    ];
    const handleDetail = (property: PropertyCompare) => {
        navigate(`/property/detail/${property._id}`);
    };
    return (
        <div className='border-2 border-gray-200 p-4 m-2' >
            <table className='w-full'>
                <thead >
                    <tr>
                        <th className='w-40 bg-blue-50 border-r-2 border-gray-200' ></th>
                        {properties.map((property) => (
                            <th key={property._id} className="align-top p-2  border-gray-200 border-b-2">
                                <div className='flex flex-col text-start cursor-pointer' onClick={() => handleDetail(property)} >
                                    <img src={property.images[0]} alt="" className='w-34 h-20 my-2' />
                                    <span className='text-xs font-light text-gray-500 break-keep w-34'>
                                        {property.address[currentLanguage]}
                                        , {property.district_id.district_name[currentLanguage]}
                                        , {property.ward_id.ward_name[currentLanguage]}
                                        , {property.city_id.city_name[currentLanguage]}
                                    </span>
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {fields.map((field, index) => (
                        <tr key={field.label} className={index % 2 === 1 ? "bg-blue-50" : ""} >
                            <th className='text-start 0 p-3 border-2 border-gray-200 border-l-0'>
                                {field.label}
                            </th>
                            {properties.map((property) => (
                                <td key={property._id} className="align-top p-2 border-2 border-gray-200 border-l-0 border-r-0">
                                    {field.value(property)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default PropertiesCompare;
