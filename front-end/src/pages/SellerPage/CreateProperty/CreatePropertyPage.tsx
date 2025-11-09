import SelectFeatures from '@/components/seller/CreateProperty/SelectFeatures';
import FormProperty from '@/components/seller/CreateProperty/FormProperty';
import React, { useState } from 'react';
import SelectImages from '@/components/seller/CreateProperty/SelectImages';
import { createProperty } from '@/services/propertyService';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
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

interface ImageItem {
    id: string;
    url: string;
    file: File;
}
const initialFormData: PropertyData = {
    title: '',
    price: '',
    description: '',
    address: '',
    bathrooms: '',
    bedrooms: '',
    area: '',
    unit: 'm2',
    floors: '',
    yearBuilt: '',
    city_id: '',
    category_id: '',
    type_id: '',
    coordinates: undefined,
};
const CreatePropertyPage = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [propertyData, setPropertyData] = useState<PropertyData>(initialFormData);
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
    const [images, setImages] = useState<ImageItem[]>([]);
    const { t } = useTranslation('createPropertyPage');
    const totalSteps = 3;

    const handleNextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePreviousStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleFormSubmit = (data: PropertyData) => {
        setPropertyData(data);
        handleNextStep();
    };

    const handleFeaturesSubmit = (features: string[]) => {
        setSelectedFeatures(features);
        handleNextStep();
    };

    const handleImagesSubmit = (imageList: ImageItem[]) => {
        setImages(imageList);
        handleFinalSubmit();
    };
    const navigate = useNavigate();
    const handleFinalSubmit = async () => {
        try {
            if (!propertyData.city_id || !propertyData.category_id || !propertyData.type_id) {
                toast.error(t('createProperty.alerts.missingRequired'));
                return;
            }

            const imageFiles = images.map((img) => img.file);
            const dataToSend = {
                ...propertyData,
                features: selectedFeatures,
            };

            console.log('Sending property data:', dataToSend);
            console.log('Images count:', imageFiles.length);

            const response = await createProperty(dataToSend, imageFiles);
            setPropertyData(initialFormData);
            setSelectedFeatures([]);
            setImages([]);
            setCurrentStep(1);
            const toastId = toast.info(
                <div className="space-y-2">
                    <p className="font-medium">{t('createProperty.alerts.createSuccess')}</p>
                    <div className="flex gap-3 mt-2">
                        <button
                            onClick={() => {
                                toast.dismiss(toastId);
                                toast.success(t('createProperty.alerts.startNew'));
                                setPropertyData(initialFormData);
                                setCurrentStep(1);
                            }}
                            className="px-3 py-1 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
                        >
                            {t('createProperty.buttons.createNew')}
                        </button>
                        <button
                            onClick={() => {
                                toast.dismiss(toastId);
                                navigate('/seller/properties');
                            }}
                            className="px-3 py-1 rounded-md bg-gray-300 text-gray-800 text-sm hover:bg-gray-400 transition"
                        >
                            {t('createProperty.buttons.viewList')}
                        </button>
                    </div>
                </div>,
                {
                    autoClose: 4000,
                    closeOnClick: false,
                    pauseOnHover: true,
                }
            );
            setTimeout(() => {
                if (toast.isActive(toastId)) {
                    toast.dismiss(toastId);
                    navigate('/seller/properties');
                }
            }, 4000);
            console.log('Created property:', response);
        } catch (error: any) {
            console.error('Error creating property:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra';
            toast.error(t('createProperty.alerts.createError', { message: errorMessage }));
        }
    };

    const steps = [
        { number: 1, title: t('createProperty.steps.1') },
        { number: 2, title: t('createProperty.steps.2') },
        { number: 3, title: t('createProperty.steps.3') },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => (
                            <React.Fragment key={step.number}>
                                <div className="flex flex-col items-center flex-1">
                                    <div
                                        className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg transition-all ${currentStep >= step.number
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-300 text-gray-600'
                                            }`}
                                    >
                                        {currentStep > step.number
                                            ? t('createProperty.stepsHeader.completed')
                                            : step.number}
                                    </div>
                                    <p
                                        className={`mt-2 text-sm font-medium ${currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'
                                            }`}
                                    >
                                        {step.title}
                                    </p>
                                </div>
                                {index < steps.length - 1 && (
                                    <div
                                        className={`flex-1 h-1 mx-2 transition-all ${currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
                                            }`}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div className="mb-6">
                    {currentStep === 1 && (
                        <FormProperty initialData={propertyData} onSubmit={handleFormSubmit} />
                    )}
                    {currentStep === 2 && (
                        <SelectFeatures
                            selectedFeatures={selectedFeatures}
                            onSubmit={handleFeaturesSubmit}
                            onBack={handlePreviousStep}
                        />
                    )}
                    {currentStep === 3 && (
                        <SelectImages
                            images={images}
                            onSubmit={handleImagesSubmit}
                            onBack={handlePreviousStep}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreatePropertyPage;
