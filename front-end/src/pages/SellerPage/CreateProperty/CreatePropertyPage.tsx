
import SelectFeatures from '@/components/seller/CreateProperty/SelectFeatures';
import FormProperty from '@/components/seller/CreateProperty/FormProperty';
import React, { useState } from 'react'
import SelectImages from '@/components/seller/CreateProperty/SelectImages';

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

interface ImageItem {
    id: string;
    url: string;
    file: File;
}

const CreatePropertyPage = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [propertyData, setPropertyData] = useState<PropertyData>({
        title: '',
        price: '',
        description: '',
        address: '',
        bathrooms: '',
        bedrooms: '',
        propertyType: '',
        area: '',
        unit: '',
        floors: '',
        transactionType: ''
    });
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
    const [images, setImages] = useState<ImageItem[]>([]);

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
        // Submit tất cả dữ liệu lên server
        handleFinalSubmit();
    };

    const handleFinalSubmit = () => {
        // Tổng hợp tất cả dữ liệu
        const finalData = {
            ...propertyData,
            features: selectedFeatures,
            images: images
        };

        console.log('Final Property Data:', finalData);
        // TODO: Gọi API để tạo property
        alert('Tạo bất động sản thành công!');
    };

    const steps = [
        { number: 1, title: 'Thông tin BĐS' },
        { number: 2, title: 'Tiện ích' },
        { number: 3, title: 'Hình ảnh' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Stepper Progress */}
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
                                        {currentStep > step.number ? '✓' : step.number}
                                    </div>
                                    <p className={`mt-2 text-sm font-medium ${currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'}`}>
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

                {/* Step Content */}
                <div className="mb-6">
                    {currentStep === 1 && (
                        <FormProperty
                            initialData={propertyData}
                            onSubmit={handleFormSubmit}
                        />
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

                {/* Navigation Buttons - Hiển thị nếu cần */}
                {/* Các button này có thể được đưa vào trong từng component con */}
            </div>
        </div>
    )
}

export default CreatePropertyPage;

