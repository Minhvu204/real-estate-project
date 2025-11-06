import React, { useRef, useState, type DragEvent, type ChangeEvent } from "react";

type ImageItem = {
    id: string;
    url: string;
    file: File;
};

interface SelectImagesProps {
    images: ImageItem[];
    onSubmit: (images: ImageItem[]) => void;
    onBack: () => void;
}

const SelectImages: React.FC<SelectImagesProps> = ({ images: initialImages, onSubmit, onBack }) => {
    const [images, setImages] = useState<ImageItem[]>(initialImages);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFiles = (files: FileList | null) => {
        if (!files) return;

        const validFiles = Array.from(files).filter((file) =>
            file.type.startsWith("image/")
        );

        const newImages: ImageItem[] = validFiles
            .slice(0, 10 - images.length)
            .map((file) => ({
                id: Math.random().toString(36).substring(2),
                url: URL.createObjectURL(file),
                file,
            }));

        setImages((prev) => [...prev, ...newImages]);
    };

    const handleRemove = (id: string) => {
        setImages((prev) => prev.filter((img) => img.id !== id));
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(false);
        handleFiles(e.dataTransfer.files);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => {
        setDragOver(false);
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        handleFiles(e.target.files);
    };

    const handleSubmit = () => {
        if (images.length === 0) {
            alert('Vui lòng chọn ít nhất 1 ảnh!');
            return;
        }
        onSubmit(images);
    };

    return (
        <div className="bg-white shadow-md rounded-2xl p-6 space-y-5 flex flex-col justify-center">
            <h1 className="text-center text-3xl font-semibold text-blue-600 mb-4">
                Chọn ảnh bất động sản
            </h1>

            <div>
                <p className="text-lg font-semibold mb-3">
                    Chọn ảnh (tối đa 10 ảnh) - Đã chọn: {images.length}/10
                </p>

                <div
                    className={`border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer ${dragOver
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 bg-gray-50"
                        }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <i className="fas fa-cloud-upload-alt text-4xl text-blue-500 mb-3"></i>
                    <p className="text-gray-600">
                        Kéo thả hình ảnh vào đây hoặc{" "}
                        <span className="text-blue-600 font-semibold underline">
                            chọn file
                        </span>

                    </p>
                    <input
                        title="file"
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleInputChange}
                    />
                </div>
                {images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                        {images.map((img) => (
                            <div
                                key={img.id}
                                className="relative rounded-lg overflow-hidden group"
                            >
                                <img
                                    src={img.url}
                                    alt="preview"
                                    className="w-full h-32 object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemove(img.id)}
                                    className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                >
                                    ×
                                </button>
                            </div>
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
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300"
                >
                    Hoàn thành
                </button>
            </div>
        </div>
    );
};

export default SelectImages;
