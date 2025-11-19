import { generatePropertyDescription, getAllCities, getAllDistrictsByCityId, getAllFeatures, getAllTaxonomies, getAllWardsByDistrictId } from "@/services/propertyService";
import type { Taxonomy } from "@/types/Taxonomy";
import { getLanguage, type Lang } from "@/utils/storage";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import CurrencyInput from 'react-currency-input-field';
import type { City } from "@/types/City";
import type { District } from "@/types/District";
import type { Ward } from "@/types/Ward";
import AddressInputOnBlur from "@/components/common/AddressInputOnBlur";
import type { PropertyData, PropertyFormData } from "@/types/PropertyData";
import Select from 'react-select';
import LocationSelect from "@/components/common/LocationSelect";
import ApartmentInfo from "./ApartmentInfo";
import SelectFeatures from "./SelectFeatures";
import type { Feature } from "@/types/Feature";

interface FormPropertyProps {
    initialData: PropertyData;
    onSubmit: (data: PropertyData) => void;
}
interface SelectOption {
    value: string;
    label: string;
}
const FormProperty: React.FC<FormPropertyProps> = ({ initialData, onSubmit }) => {
    const [formData, setFormData] = useState<PropertyData>(initialData);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [taxonomies, setTaxonomies] = useState<Taxonomy | null>(null);
    const [cities, setCities] = useState<City[] | null>(null);
    const [districts, setDistricts] = useState<District[] | null>(null);
    const [wards, setWards] = useState<Ward[] | null>(null);
    const { t } = useTranslation("createPropertyPage");
    const [availableFeatures, setAvailableFeatures] = useState<Feature[]>([]);
    const [featuresLoading, setFeaturesLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const currentLanguage: Lang = getLanguage();
    const cityOptions = (cities ?? []).map(city => ({
        value: city._id,
        label: city.city_name[currentLanguage]
    }));
    const districtOptions = (districts ?? []).map(district => ({
        value: district._id,
        label: district.district_name[currentLanguage]
    }));
    const wardOptions = (wards ?? []).map(ward => ({
        value: ward._id,
        label: ward.ward_name[currentLanguage]
    }));
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                const [tax, citiesData, featuresData] = await Promise.all([
                    getAllTaxonomies(),
                    getAllCities(),
                    getAllFeatures()
                ]);
                setTaxonomies(tax);
                setCities(citiesData);
                setAvailableFeatures(featuresData);
            } catch (err) {
                console.error(err);
                setError(t("formProperty.errorFetch"));
            } finally {
                setLoading(false);
                setFeaturesLoading(false);
            }
        };
        fetchInitialData();
    }, []);
    useEffect(() => {
        if (formData.city_id) {
            const fetchDistricts = async () => {
                try {
                    setError(null);
                    const data = await getAllDistrictsByCityId(formData.city_id);
                    setDistricts(data);
                } catch (error) {
                    console.log('Error Fetch', error);
                    setError("Error Fetch Districts");
                }
            }
            fetchDistricts();
        }
        return () => {
            setDistricts(null);
        }
    }, [formData.city_id]);
    useEffect(() => {
        if (!formData.city_id || !formData.district_id) {
            setWards(null);
            return;
        }

        const fetchWards = async () => {
            try {
                setError(null);
                const data = await getAllWardsByDistrictId(formData.district_id);
                setWards(data);
            } catch (error) {
                setError("Error Fetch Wards");
            }
        };

        fetchWards();
    }, [formData.city_id, formData.district_id]);
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        console.log(formData);
        setFormData(prev => {
            return { ...prev, [name]: value };
        });
    };
    const handleCityChange = (selected: SelectOption | null) => {
        const value = selected?.value ?? "";
        setFormData(prev => ({
            ...prev,
            city_id: value,
            district_id: "",
            ward_id: "",
        }));
    };
    const handleDistrictChange = (selected: SelectOption | null) => {
        const value = selected?.value ?? "";
        setFormData(prev => ({
            ...prev,
            district_id: value,
            ward_id: "",
        }));
    };
    const handleWardChange = (selected: SelectOption | null) => {
        const value = selected?.value ?? "";
        setFormData(prev => ({
            ...prev,
            ward_id: value,
        }));
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const requiredFields = ["title", "price", "description", "address", "city_id", "category_id", "type_id"];
        const missing = requiredFields.some(f => !(formData as any)[f]);
        if (missing) {
            toast.error(t("formProperty.alertMissing"));
            return;
        }
        onSubmit(formData);
    };

    const getCityNameById = (cityId: string) => {
        const city = cities?.find(city => city._id === cityId);
        return city ? city.city_name[currentLanguage] : "";
    }
    const getDistrictNameById = (districtId: string) => {
        const district = districts?.find(district => district._id === districtId);
        return district ? district.district_name[currentLanguage] : "";
    }
    const getWardNameById = (wardId: string) => {
        const ward = wards?.find(ward => ward._id === wardId);
        return ward ? ward.ward_name[currentLanguage] : "";
    }
    const apartmentType = taxonomies?.categories.find(
        (c) => c.category_name.en === "Apartment"
    );
    const featureNames: string[] = formData.features.map(id => {
        const f = availableFeatures.find(feat => feat._id === id);
        return f ? f.feature_name[currentLanguage] : "";
    }).filter(Boolean);
    const handleGenerateDescription = async () => {
        if (!formData.title) {
            toast.error("Title is required to generate description");
            return;
        }
        try {
            setGenerating(true);
            const dataForAI: PropertyFormData = {
                title: formData.title,
                price: formData.price,
                category_name: taxonomies?.categories.find(c => c._id === formData.category_id)?.category_name[currentLanguage] || "",
                type_name: taxonomies?.propertyTypes.find(t => t._id === formData.type_id)?.type_name[currentLanguage] || "",
                bedrooms: formData.bedrooms,
                bathrooms: formData.bathrooms,
                area: formData.area,
                address: formData.address,
                ward_name: getWardNameById(formData.ward_id),
                district_name: getDistrictNameById(formData.district_id),
                city_name: getCityNameById(formData.city_id),
                features_names: featureNames,
                floor_number: formData.floors,
                building_block: formData.building_block,
                apartment_number: formData.apartment_number,
            };
            console.log("data for AI", dataForAI);
            const descriptionObj = await generatePropertyDescription(dataForAI);
            setFormData(prev => ({
                ...prev,
                description: descriptionObj.description
            }));
            toast.success("Description generated successfully");
        } catch (err) {
            console.error(err);
            toast.error("Failed to generate description");
        } finally {
            setGenerating(false);
        }
    }
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-1 text-xs md:text-sm">
                                    {t("formProperty.price")} <span className="text-red-500">*</span>
                                </label>
                                <CurrencyInput
                                    name="price"
                                    value={formData.price}
                                    allowDecimals={false}
                                    allowNegativeValue={false}
                                    onValueChange={(value) => {
                                        setFormData(prev => ({
                                            ...prev,
                                            price: value ?? ""
                                        }))
                                    }}
                                    placeholder={t("formProperty.placeholder.price")}
                                    className="w-full border border-gray-300 rounded-lg p-1.5 md:p-2 text-xs md:text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-1 text-xs md:text-sm">
                                    {t("formProperty.type")} <span className="text-red-500">*</span>
                                </label>
                                <div className="text-xs">
                                    <Select
                                        options={taxonomies?.propertyTypes?.map(p => ({
                                            value: p._id,
                                            label: p.type_name[currentLanguage]
                                        }))}
                                        value={
                                            taxonomies?.propertyTypes
                                                ?.map(p => ({ value: p._id, label: p.type_name[currentLanguage] }))
                                                .find(o => o.value === formData.type_id) ?? null
                                        }
                                        onChange={(selected) => {
                                            setFormData(prev => ({ ...prev, type_id: selected?.value ?? "" }))
                                        }}
                                        placeholder={t("formProperty.select.type")}
                                        isClearable
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-1 text-xs md:text-sm">
                                    {t("formProperty.category")} <span className="text-red-500">*</span>
                                </label>
                                <div className="text-xs">
                                    <Select
                                        options={taxonomies?.categories?.map(c => ({
                                            value: c._id,
                                            label: c.category_name[currentLanguage]
                                        }))}
                                        value={
                                            taxonomies?.categories
                                                ?.map(c => ({ value: c._id, label: c.category_name[currentLanguage] }))
                                                .find(o => o.value === formData.category_id) ?? null
                                        }
                                        onChange={(selected) =>
                                            setFormData(prev => ({ ...prev, category_id: selected?.value ?? "" }))
                                        }
                                        placeholder={t("formProperty.select.category")}
                                        isClearable
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 grid-cols-1 mt-2 gap-5">
                        <div>
                            <LocationSelect
                                label={t("formProperty.city")}
                                value={formData.city_id}
                                options={cityOptions}
                                placeholder={t("formProperty.select.city")}
                                onChange={handleCityChange}
                            />
                        </div>
                        <div>
                            <LocationSelect
                                label={t("formProperty.district")}
                                value={formData.district_id}
                                options={districtOptions}
                                placeholder={t("formProperty.select.district")}
                                onChange={handleDistrictChange}
                                disabled={!formData.city_id}
                            />
                        </div>
                        <div>
                            <LocationSelect
                                label={t("formProperty.ward")}
                                value={formData.ward_id}
                                options={wardOptions}
                                placeholder={t("formProperty.select.ward")}
                                onChange={handleWardChange}
                                disabled={!formData.district_id}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                        <div className="">
                            <label className="block text-gray-700 font-medium mb-1 text-xs md:text-sm">
                                {t("formProperty.address")} <span className="text-red-500">*</span>
                            </label>
                            <AddressInputOnBlur
                                city={getCityNameById(formData.city_id)}
                                district={getDistrictNameById(formData.district_id)}
                                ward={getWardNameById(formData.ward_id)}
                                value={formData.address}
                                onChange={(val) => setFormData({ ...formData, address: val })}
                                onSelect={(lat, lon) =>
                                    setFormData({
                                        ...formData, coordinates: {
                                            type: "Point",
                                            coordinates: [
                                                lon,
                                                lat,
                                            ]
                                        }
                                    })
                                }
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 ">
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
                                    {t("formProperty.area")}<span className="text-red-500">*</span>
                                </label>
                                <CurrencyInput
                                    name="area"
                                    value={formData.area}
                                    allowDecimals={false}
                                    allowNegativeValue={false}
                                    placeholder={t("formProperty.placeholder.area")}
                                    onValueChange={(value) => {
                                        setFormData(prev => ({
                                            ...prev,
                                            area: value ?? ""
                                        }));
                                    }}
                                    className="w-full border border-gray-300 rounded-lg p-1.5 md:p-2 text-xs md:text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                                />
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
                        </div>
                    </div>
                    <ApartmentInfo formData={formData} setFormData={setFormData} apartmentTypeId={apartmentType?._id} />
                    <SelectFeatures
                        selectedFeatures={formData.features}
                        onChange={features => setFormData(prev => ({ ...prev, features }))}
                        availableFeatures={availableFeatures}
                        loading={featuresLoading}
                    />
                    <div className="mt-2">
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
                            maxLength={1000}
                        ></textarea>
                    </div>
                    <div className="mt-2">
                        <button
                            title="genAI"
                            type="button"
                            onClick={handleGenerateDescription}
                            disabled={generating || !formData.title}
                            className={`bg-green-400 hover:bg-green-700 text-white font-semibold px-4 md:px-6 py-1.5 md:py-2 text-sm md:text-base rounded-lg transition-all duration-300 cursor-pointer ${generating ? "opacity-50 cursor-not-allowed" : ""
                                }`}>
                            {t("formProperty.autoDescription")}
                        </button>
                    </div>
                </div>
            )
            }
            <div className="pt-3 md:pt-4 flex justify-end">
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 md:px-6 py-1.5 md:py-2 text-sm md:text-base rounded-lg transition-all duration-300 cursor-pointer"
                >
                    {t("formProperty.continue")}
                </button>
            </div>
        </form >
    );
};

export default FormProperty;
