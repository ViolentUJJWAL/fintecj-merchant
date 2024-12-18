import React from 'react';

const FinalStep = ({ 
    formData, 
    updateForm, 
    isCameraOpen, 
    setIsCameraOpen, 
    stream, 
    openCamera, 
    capturePhoto, 
    closeCamera 
}) => {
    return (
        <div className="space-y-4">
            <ProfilePhotoSection 
                formData={formData}
                openCamera={openCamera}
                isCameraOpen={isCameraOpen}
                stream={stream}
                closeCamera={closeCamera}
                capturePhoto={capturePhoto}
                updateForm={updateForm}
            />
            
            <h2 className="text-lg font-semibold text-center mt-4">{formData.name}</h2>
            <p className="text-sm text-gray-600 text-center mb-6">Complete Profile Setup</p>

            <TermsAndConditions 
                formData={formData}
                updateForm={updateForm}
            />
        </div>
    );
};

const ProfilePhotoSection = ({ 
    formData, 
    openCamera, 
    isCameraOpen, 
    stream, 
    closeCamera, 
    capturePhoto, 
    updateForm 
}) => (
    <div className="relative flex justify-center mb-6">
        {formData.profile ? (
            <img
                src={URL.createObjectURL(formData.profile)}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
            />
        ) : (
            <div className="w-24 h-24 bg-blue-900 rounded-full flex items-center justify-center">
                <span className="text-white text-4xl">📷</span>
            </div>
        )}

        <button
            onClick={openCamera}
            className="absolute top-1/2 left-1/2 bg-blue-500 rounded-full p-2 cursor-pointer h-7 w-7 flex items-center justify-center"
            style={{ transform: 'translate(60%, 45%)' }}
        >
            <span className="text-white text-xl">+</span>
        </button>

        {isCameraOpen && (
            <CameraModal 
                stream={stream}
                closeCamera={closeCamera}
                capturePhoto={capturePhoto}
            />
        )}

        <input
            type="file"
            id="profile-picture"
            onChange={(e) => updateForm('profile', e.target.files[0])}
            className="hidden"
        />
    </div>
);

const CameraModal = ({ stream, closeCamera, capturePhoto }) => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-4 relative">
            <button
                onClick={closeCamera}
                className="absolute top-2 right-2 text-red-500 text-xl"
            >
                ✕
            </button>

            <video
                id="video-feed"
                autoPlay
                playsInline
                muted
                className="w-full h-auto rounded-lg"
                ref={(video) => {
                    if (video && stream) {
                        video.srcObject = stream;
                    }
                }}
            />

            <button
                onClick={capturePhoto}
                className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg"
            >
                Capture Photo
            </button>
        </div>
    </div>
);

const TermsAndConditions = ({ formData, updateForm }) => (
    <>
        <h2 className="text-sm font-semibold mb-4">Terms & Conditions</h2>
        <div className="flex items-start">
            <input
                type="checkbox"
                checked={formData.agreedToTerms}
                onChange={(e) => updateForm('agreedToTerms', e.target.checked)}
                className="h-4 w-4 text-blue-900 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">
                I agree to the Terms of Service and Privacy Policy
            </label>
        </div>
    </>
);

export default FinalStep;