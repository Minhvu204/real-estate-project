import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getLanguage, type Lang } from "@/utils/storage";
import Favorite from "@/components/Property/FavoriteIconProps";
import type { PropertyFavorite } from "@/types/FavoriteType";

type PropertyCardProps = {
    property: PropertyFavorite;
    onRemoveFavorite?: (property: PropertyFavorite) => void;
    onToggleCompare?: () => void;
    isCompared?: boolean;
    disabledCompare?: boolean;
}

const PropertyCardFavorite: React.FC<PropertyCardProps> = ({ property, onRemoveFavorite, onToggleCompare, isCompared, disabledCompare }) => {
    const navigate = useNavigate();
    const currentLanguage: Lang = getLanguage();
    const { t } = useTranslation('propertyPage');
    const handleDetail = () => {
        navigate(`/property/detail/${property.property_id}`);
    };

    return (
        <div className="bg-white rounded-md shadow hover:shadow-lg transition-all duration-300 overflow-hidden ring-2 ring-gray-200">
            <div className="flex m-2">
                {!disabledCompare ? (
                    <>
                        <input
                            type="checkbox"
                            title="compare"
                            checked={isCompared}
                            onChange={onToggleCompare}
                            className="size-6 m-2 cursor-pointer"
                        />
                        <div className="font-bold my-2">Compare</div>
                    </>
                ) : (
                    <div className="font-bold my-2 text-gray-400">Không thể so sánh</div>
                )}
            </div>
            <div className="aspect-4/3 w-full relative">
                {property.type?.type_name[currentLanguage] && (
                    <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                        {property.type?.type_name[currentLanguage]}
                    </div>
                )}
                <div className="absolute right-2 top-1">
                    <Favorite property_id={property.property_id}
                        onRemove={() => onRemoveFavorite && onRemoveFavorite(property)}
                        mode="delayed"
                    />
                </div>
                <img
                    src={property.images[0]}
                    alt={property.title[currentLanguage]}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="p-3 space-y-1">
                <h3 className="font-semibold text-gray-900 text-sm md:text-base line-clamp-1">
                    {property.title[currentLanguage]}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-1">{property.address[currentLanguage]}</p>
                <p className="text-blue-600 font-bold text-sm">
                    {property.price >= 1_000_000_000
                        ? `${(property.price / 1_000_000_000).toFixed(1)} Tỷ`
                        : property.price >= 1_000_000
                            ? `${(property.price / 1_000_000).toFixed(1)} Triệu`
                            : property.price >= 1_000 ? `${(property.price / 1_000).toFixed(1)} Nghìn` : `${property.price}`} VNĐ
                </p>
                <p className="text-xs text-gray-600">
                    {property.bedrooms} {t("propertyCard.bedrooms")} · {property.bathrooms} {t("propertyCard.bathrooms")}
                </p>
                <button
                    onClick={handleDetail}
                    className="mt-2 w-full py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer"
                >
                    {t("propertyCard.viewDetail")}
                </button>
            </div>
        </div>
    );
}

export default PropertyCardFavorite;