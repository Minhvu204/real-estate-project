import React, { useRef, useState, type DragEvent, type ChangeEvent, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

type ImageItem = {
    id: string;
    url: string;
    file: File;
};

interface SelectImagesProps {
    images: ImageItem[];
    onSubmit: (images: ImageItem[]) => void;
    onBack: () => void;
    isSubmitting?: boolean;
}

const SelectImages: React.FC<SelectImagesProps> = ({ images: initialImages, onSubmit, onBack, isSubmitting = false }) => {
    const [images, setImages] = useState<ImageItem[]>(() => initialImages);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const { t } = useTranslation("createPropertyPage");
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

    const handleDragLeave = () => setDragOver(false);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        handleFiles(e.target.files);
    };

    const handleSubmit = () => {
        if (images.length === 0) {
            toast.error(t("selectImages.alertEmpty"));
            return;
        }
        onSubmit(images);
    };

    return (
        <div className="bg-white shadow-md rounded-2xl p-6 space-y-5 flex flex-col justify-center">
            <h1 className="text-center text-3xl font-semibold text-blue-600 mb-4">
                {t("selectImages.title")}
            </h1>

            <div>
                <p className="text-lg font-semibold mb-3">
                    {t("selectImages.subtitle", { count: images.length })}
                </p>

                <div
                    className={`border-2 border-dashed rounded-xl p-10 text-center transition-all ${isSubmitting
                        ? "cursor-not-allowed opacity-50 border-gray-300 bg-gray-100"
                        : dragOver
                            ? "cursor-pointer border-blue-500 bg-blue-50"
                            : "cursor-pointer border-gray-300 bg-gray-50"
                        }`}
                    onDrop={isSubmitting ? undefined : handleDrop}
                    onDragOver={isSubmitting ? undefined : handleDragOver}
                    onDragLeave={isSubmitting ? undefined : handleDragLeave}
                    onClick={isSubmitting ? undefined : () => fileInputRef.current?.click()}
                >
                    <i className="fas fa-cloud-upload-alt text-4xl text-blue-500 mb-3"></i>
                    <p className="text-gray-600">
                        {t("selectImages.dragText")}{" "}
                        <span className="text-blue-600 font-semibold underline">
                            {t("selectImages.chooseFile")}
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
                                className={`relative rounded-lg overflow-hidden group ${isSubmitting ? 'opacity-75' : ''}`}
                            >
                                <img
                                    src={img.url}
                                    alt="preview"
                                    className="w-full h-32 object-cover"
                                />
                                {!isSubmitting && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemove(img.id)}
                                        className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="pt-4 flex justify-between">
                <button
                    type="button"
                    onClick={onBack}
                    disabled={isSubmitting}
                    className="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {t("createProperty.buttons.back")}
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 disabled:opacity-75 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </>
                    ) : (
                        t("selectImages.finish")
                    )}
                </button>
            </div>
        </div>
    );
};

export default SelectImages;
