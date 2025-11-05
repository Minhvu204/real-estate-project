import React, { useState } from "react";

interface PropertyData {
    title: string;
    price: string;
    description: string;
    address: string;
    bathrooms: string;
    bedrooms: string;
    propertyType: string;
    area: string;
    unit: string;
    floors: string;
    transactionType: string;
}

interface FormPropertyProps {
    initialData: PropertyData;
    onSubmit: (data: PropertyData) => void;
}

const FormProperty: React.FC<FormPropertyProps> = ({ initialData, onSubmit }) => {

    const [formData, setFormData] = useState<PropertyData>(initialData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form
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
                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Eg: 123 Ngũ Hành Sơn, Đà Nẵng"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                    required
                />
            </div>
            <div className="grid grid-col-1 md:grid-cols-3 gap-4">
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
                        Loại BĐS
                    </label>
                    <select
                        name="propertyType"
                        value={formData.propertyType}
                        onChange={handleChange}
                        title="type"
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                    >
                        <option value="">Chọn loại bất động sản</option>
                        <option value="villa">Biệt thự</option>
                        <option value="house">Nhà cấp 4</option>
                        <option value="apartment">Căn hộ</option>
                        <option value="land">Đất</option>
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
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
                        <option value="">Chọn đơn vị</option>
                        <option value="m2">m²</option>
                        <option value="km2">km²</option>
                        <option value="ha">ha</option>
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        Số tầng
                    </label>
                    <select
                        name="floors"
                        value={formData.floors}
                        onChange={handleChange}
                        title="floor"
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                    >
                        <option value="">Chọn số tầng</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        Hình thức giao dịch
                    </label>
                    <select
                        name="transactionType"
                        value={formData.transactionType}
                        onChange={handleChange}
                        title="type"
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                    >
                        <option value="">Chọn hình thức</option>
                        <option value="rent">Cho thuê</option>
                        <option value="sell">Bán</option>
                    </select>
                </div>
            </div>
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
