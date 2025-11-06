import AddressAutocomplete from "@/components/common/AddressAutocomplete";
import { getAllTaxonomies } from "@/services/propertyService";
import type { Taxonomy } from "@/types/Taxonomy";
import { getLanguage, type Lang } from "@/utils/storage";
import React, { useEffect, useState } from "react";

type common = number | string

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
    const currentLanguage: Lang = getLanguage();
    const [taxonomies, setTaxonomies] = useState<Taxonomy | null>(null);
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getAllTaxonomies();
                setTaxonomies(data);
            } catch (error) {
                console.error('Error fetch categories: ', error);
                setError('Khong the tai danh muc bat dong san');
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.price || !formData.description || !formData.address) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
            return;
        }
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className=" bg-white shadow-md rounded-2xl p-6 space-y-5 flex flex-col justify-center" >
            <h2 className="text-3xl font-semibold text-blue-600 text-center mb-4">
                Thông tin Bất động sản
            </h2>
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
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Đang tải thôn tin...</span>
                </div>
            ) : (

                <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div >
                            <label className="block text-gray-700 font-medium mb-1">
                                Tiêu đề <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Eg: Homestay view sông"
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">
                                Giá (VNĐ) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="Eg: 10000000"
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Mô tả <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Nhập mô tả ngắn gọn về bất động sản..."
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                            required
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Địa chỉ <span className="text-red-500">*</span>
                        </label>
                        <AddressAutocomplete
                            value={formData.address}
                            onSelect={(addr, lat, lon) => {
                                setFormData({
                                    ...formData,
                                    address: addr,
                                    coordinates: { lat, lng: lon }
                                });
                            }}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">
                                Phòng tắm
                            </label>
                            <input
                                type="number"
                                name="bathrooms"
                                value={formData.bathrooms}
                                onChange={handleChange}
                                placeholder="Eg: 2"
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">
                                Phòng ngủ
                            </label>
                            <input
                                type="number"
                                name="bedrooms"
                                value={formData.bedrooms}
                                onChange={handleChange}
                                placeholder="Eg: 3"
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">
                                Thành phố <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="city_id"
                                value={formData.city_id}
                                onChange={handleChange}
                                required
                                title="city"
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                            >
                                <option value="">Chọn thành phố</option>
                                {taxonomies?.cities?.map((city) => (
                                    <option key={city._id} value={city._id}>
                                        {city.city_name[currentLanguage]}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">
                                Loại BĐS <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleChange}
                                required
                                title="category"
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                            >
                                <option value="">Chọn loại BĐS</option>
                                {taxonomies?.categories?.map((c) => (
                                    <option key={c._id} value={c._id}>{c.category_name[currentLanguage]}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">
                                Diện tích
                            </label>
                            <input
                                type="number"
                                name="area"
                                value={formData.area}
                                onChange={handleChange}
                                placeholder="Eg: 100"
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">
                                Đơn vị
                            </label>
                            <select
                                name="unit"
                                value={formData.unit}
                                onChange={handleChange}
                                title="unit"
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                            >
                                <option value="m2">m²</option>
                                <option value="ft2">ft²</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">
                                Số tầng
                            </label>
                            <input
                                type="number"
                                name="floors"
                                value={formData.floors}
                                onChange={handleChange}
                                placeholder="Eg: 2"
                                min="1"
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">
                                Hình thức giao dịch <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="type_id"
                                value={formData.type_id}
                                onChange={handleChange}
                                required
                                title="propertyType"
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                            >
                                <option value="">Chọn hình thức</option>
                                {taxonomies?.propertyTypes?.map((p) => (
                                    <option key={p._id} value={p._id}>{p.type_name[currentLanguage]}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}
            <div className="pt-4 flex justify-end">
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300"
                >
                    Tiếp tục
                </button>
            </div>
        </form>
    );
};

export default FormProperty;
