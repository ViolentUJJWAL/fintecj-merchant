import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/authServices';

// Components
import ProgressStep from './components/ProgressStep';
import BasicInfo from './components/BasicInfo';
import VerificationCode from './components/VerificationCode';
import BusinessDetails from './components/BusinessDetails';
import Documents from './components/Documents';
import FinalStep from './components/FinalStep';

// Hooks
import { useSellerForm } from './hooks/useSellerForm';
import { useFormValidation } from './hooks/useFormValidation';

// Utils
import { createFormData } from './utils/formUtils';

const SellerRegistration = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [useShopaddress, setUseShopaddress] = useState(false);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [stream, setStream] = useState(null);

    const { formData, updateForm } = useSellerForm();
    const { validateField, validateStep } = useFormValidation();
    const totalSteps = 5;

    // Camera handlers
    const openCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'user',
                    width: { ideal: 520 },
                    height: { ideal: 520 },
                },
            });
            setStream(mediaStream);
            setIsCameraOpen(true);
        } catch (error) {
            console.error('Error accessing the camera:', error);
        }
    };

    const closeCamera = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
        }
        setStream(null);
        setIsCameraOpen(false);
    };

    const capturePhoto = () => {
        const video = document.getElementById('video-feed');
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
            const file = new File([blob], 'profile.png', { type: 'image/png' });
            updateForm('profile', file);
        }, 'image/png');

        closeCamera();
    };

    // Form handlers
    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        const error = validateField(field, formData[field]);
        setErrors(prev => ({ ...prev, [field]: error }));
    };

    const handleCheckboxChange = () => {
        setUseShopaddress((prev) => !prev);
        if (!useShopaddress) {
            updateForm('merchantaddress', {
                merchantstreet: formData.shopaddress.street,
                merchantcity: formData.shopaddress.city,
                merchantpostalCode: formData.shopaddress.postalCode,
                merchantcountry: formData.shopaddress.country,
            });
        }
    };

    // API handlers
    const handleBasicInfoSubmit = async () => {
        try {
            setLoading(true);
            await AuthService.sentOtp(formData.name, formData.email, formData.phoneNo);
            setStep(step + 1);
        } catch (error) {
            setErrors({ apiError: error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleOtpValidation = async () => {
        try {
            setLoading(true);
            await AuthService.checkOtp(formData.otp);
            setStep(step + 1);
        } catch (error) {
            setErrors({ apiError: error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleFinalSubmit = async () => {
        try {
            setLoading(true);
            const formDataToSend = createFormData(formData);
            await AuthService.requestForm(formDataToSend);
            navigate('/verification-success');
        } catch (error) {
            setErrors({ apiError: error.message });
        } finally {
            setLoading(false);
        }
    };

    // Navigation handlers
    const handleNext = () => {
        const stepFields = {
            1: ['name', 'email', 'phoneNo'],
            2: ['otp'],
            3: ['shopname', 'businessCategory', 'businessRegistrationNumber', 'description'],
            4: ['branchCode', 'accountName', 'accountHolder', 'bankName'],
            5: ['agreedToTerms']
        };

        const { isValid, errors: validationErrors } = validateStep(step, formData, stepFields);

        if (isValid) {
            if (step === 5) {
                handleFinalSubmit();
            } else if (step === 1) {
                handleBasicInfoSubmit();
            } else if (step === 2) {
                handleOtpValidation();
            } else {
                setStep(step + 1);
            }
        } else {
            setErrors(validationErrors);
        }
    };

    const handlePrevious = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    // Render helpers
    const renderInput = (field, label, type = 'text', options = {}) => (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <input
                type={type}
                value={formData[field]}
                onChange={(e) => updateForm(field, e.target.value)}
                onBlur={() => handleBlur(field)}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 
                    ${errors[field] ? 'border-red-500' : 'border-gray-300'}`}
                {...options}
            />
            {errors[field] && touched[field] && (
                <p className="mt-1 text-sm text-red-500">{errors[field]}</p>
            )}
        </div>
    );

    const renderAddressInput = (field, label, type = 'text', options = {}) => (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <input
                type={type}
                value={formData.shopaddress[field]}
                onChange={(e) => updateForm('shopaddress', {
                    ...formData.shopaddress,
                    [field]: e.target.value
                })}
                onBlur={() => handleBlur(field)}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 
                    ${errors[field] ? 'border-red-500' : 'border-gray-300'}`}
                {...options}
            />
            {errors[field] && touched[field] && (
                <p className="mt-1 text-sm text-red-500">{errors[field]}</p>
            )}
        </div>
    );

    const renderProgressBar = () => (
        <div className="flex justify-center w-full px-8 mb-8">
            {[...Array(totalSteps)].map((_, index) => (
                <ProgressStep
                    key={index}
                    active={step === index + 1}
                    completed={step > index + 1}
                    first={index === 0}
                    last={index === totalSteps - 1}
                />
            ))}
        </div>
    );

    const renderStep = () => {
        const commonProps = {
            formData,
            errors,
            touched,
            renderInput,
            loading
        };

        switch (step) {
            case 1:
                return <BasicInfo {...commonProps} handleBasicInfoSubmit={handleBasicInfoSubmit} />;
            case 2:
                return <VerificationCode {...commonProps} setStep={setStep} />;
            case 3:
                return (
                    <BusinessDetails
                        {...commonProps}
                        updateForm={updateForm}
                        renderAddressInput={renderAddressInput}
                    />
                );
            case 4:
                return (
                    <Documents
                        {...commonProps}
                        updateForm={updateForm}
                        useShopaddress={useShopaddress}
                        handleCheckboxChange={handleCheckboxChange}
                    />
                );
            case 5:
                return (
                    <FinalStep
                        {...commonProps}
                        updateForm={updateForm}
                        isCameraOpen={isCameraOpen}
                        setIsCameraOpen={setIsCameraOpen}
                        stream={stream}
                        openCamera={openCamera}
                        capturePhoto={capturePhoto}
                        closeCamera={closeCamera}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
            <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-xl font-bold text-blue-900">eJuuz</h1>
                    <div className="text-sm text-gray-600">Seller Registration</div>
                </div>

                {renderProgressBar()}

                <div className="mb-8">
                    {renderStep()}
                </div>

                <div className={`flex ${step < 4 ? 'justify-end' : 'justify-between'}`}>
                    {step > 3 && (
                        <button
                            onClick={handlePrevious}
                            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                        >
                            Previous
                        </button>
                    )}
                </div>

                {step === 1 && (
                    <div className="text-center mt-4">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <button
                                onClick={() => navigate('/login')}
                                className="text-blue-900 hover:text-blue-700 font-medium"
                            >
                                Go to Login
                            </button>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerRegistration;