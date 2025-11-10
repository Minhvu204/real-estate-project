import AddressAutocomplete from "@/components/common/AddressAutocomplete";
import { getAllTaxonomies } from "@/services/propertyService";
import type { Taxonomy } from "@/types/Taxonomy";
import { getLanguage, type Lang } from "@/utils/storage";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
type common = number | string;

interface PropertyData {
    title: string;
    price: common;
    description: string;
    address: string;
    bathrooms: common;
    bedrooms: common;
    area: common;
    unit: common;
    floors: common;
    yearBuilt?: common;
    city_id: string;
    category_id: string;
    type_id: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
}

interface FormPropertyProps {
    initialData: PropertyData;
    onSubmit: (data: PropertyData) => void;
}

const FormProperty: React.FC<FormPropertyProps> = ({ initialData, onSubmit }) => {
    const [formData, setFormData] = useState<PropertyData>(initialData);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [taxonomies, setTaxonomies] = useState<Taxonomy | null>(null);

    const { t } = useTranslation("createPropertyPage");
    const currentLanguage: Lang = getLanguage();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getAllTaxonomies();
                setTaxonomies(data);
            } catch (error) {
                console.error("Error fetch categories: ", error);
                setError(t("formProperty.errorFetch"));
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, [t]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.price || !formData.description || !formData.address || !formData.city_id || !formData.category_id || !formData.type_id
        ) {
            toast.error(t("formProperty.alertMissing"));
            return;
        }
        onSubmit(formData);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded-2xl p-4 md:p-6 space-y-4 flex flex-col justify-center"
        >
            <h2 className="text-xl md:text-2xl font-semibold text-blue-600 text-center mb-2">
                {t("formProperty.formTitle")}
            </h2>

            {error && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                    <p className="text-sm text-yellow-700">{error}</p>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">{t("formProperty.loading")}</span>
                </div>
            ) : (
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1 text-xs md:text-sm">
                                {t("formProperty.title")} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder={t("formProperty.placeholder.title")}
                                className="w-full border border-gray-300 rounded-lg p-1.5 md:p-2 text-xs md:text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1 text-xs md:text-sm">
                                {t("formProperty.price")} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder={t("formProperty.placeholder.price")}
                                className="w-full border border-gray-300 rounded-lg p-1.5 md:p-2 text-xs md:text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1 text-xs md:text-sm">
                            {t("formProperty.description")} <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            placeholder={t("formProperty.placeholder.description")}
                            className="w-full border border-gray-300 rounded-lg p-1.5 md:p-2 text-xs md:text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                            required
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1 text-xs md:text-sm">
                            {t("formProperty.address")} <span className="text-red-500">*</span>
                        </label>
                        <AddressAutocomplete
                            value={formData.address}
                            onSelect={(addr, lat, lon) => {
                                setFormData({
                                    ...formData,
                                    address: addr,
                                    coordinates: { lat, lng: lon },
                                });
                            }}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1 text-xs md:text-sm">
                                {t("formProperty.bathrooms")}
                            </label>
                            <input
                                type="number"
                                name="bathrooms"
                                value={formData.bathrooms}
                                onChange={handleChange}
                                placeholder={t("formProperty.placeholder.bathrooms")}
                                className="w-full border border-gray-300 rounded-lg p-1.5 md:p-2 text-xs md:text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1 text-xs md:text-sm">
                                {t("formProperty.bedrooms")}
                            </label>
                            <input
                                type="number"
                                name="bedrooms"
                                value={formData.bedrooms}
                                onChange={handleChange}
                                placeholder={t("formProperty.placeholder.bedrooms")}
                                className="w-full border border-gray-300 rounded-lg p-1.5 md:p-2 text-xs md:text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1 text-xs md:text-sm">
                                {t("formProperty.city")} <span className="text-red-500">*</span>
                            </label>
                            <select
                                title="city"
                                name="city_id"
                                value={formData.city_id}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg p-1.5 md:p-2 text-xs md:text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                            >
                                <option value="">{t("formProperty.select.city")}</option>
                                {taxonomies?.cities?.map((city) => (
                                    <option key={city._id} value={city._id}>
                                        {city.city_name[currentLanguage]}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1 text-xs md:text-sm">
                                {t("formProperty.category")} <span className="text-red-500">*</span>
                            </label>
                            <select
                                title="category"
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg p-1.5 md:p-2 text-xs md:text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                            >
                                <option value="">{t("formProperty.select.category")}</option>
                                {taxonomies?.categories?.map((c) => (
                                    <option key={c._id} value={c._id}>
                                        {c.category_name[currentLanguage]}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1 text-xs md:text-sm">
                                {t("formProperty.area")}
                            </label>
                            <input
                                type="number"
                                name="area"
                                value={formData.area}
                                onChange={handleChange}
                                placeholder={t("formProperty.placeholder.area")}
                                className="w-full border border-gray-300 rounded-lg p-1.5 md:p-2 text-xs md:text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1 text-xs md:text-sm">
                                {t("formProperty.unit")}
                            </label>
                            <select
                                title="unit"
                                name="unit"
                                value={formData.unit}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-1.5 md:p-2 text-xs md:text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                            >
                                <option value="m2">{t("formProperty.units.m2")}</option>
                                <option value="ft2">{t("formProperty.units.ft2")}</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1 text-xs md:text-sm">
                                {t("formProperty.floors")}
                            </label>
                            <input
                                type="number"
                                name="floors"
                                value={formData.floors}
                                onChange={handleChange}
                                placeholder={t("formProperty.placeholder.floors")}
                                min="1"
                                className="w-full border border-gray-300 rounded-lg p-1.5 md:p-2 text-xs md:text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1 text-xs md:text-sm">
                                {t("formProperty.type")} <span className="text-red-500">*</span>
                            </label>
                            <select
                                title="type"
                                name="type_id"
                                value={formData.type_id}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg p-1.5 md:p-2 text-xs md:text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                            >
                                <option value="">{t("formProperty.select.type")}</option>
                                {taxonomies?.propertyTypes?.map((p) => (
                                    <option key={p._id} value={p._id}>
                                        {p.type_name[currentLanguage]}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}
            <div className="pt-3 md:pt-4 flex justify-end">
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 md:px-6 py-1.5 md:py-2 text-sm md:text-base rounded-lg transition-all duration-300"
                >
                    {t("formProperty.continue")}
                </button>
            </div>
        </form>
    );
};

export default FormProperty;
