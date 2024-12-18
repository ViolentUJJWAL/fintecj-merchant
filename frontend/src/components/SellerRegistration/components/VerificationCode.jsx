import React from 'react';

const VerificationCode = ({ formData, errors, renderInput, setStep }) => {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Enter Code</h2>
            <p className="text-sm text-gray-600 mb-4">
                Enter the 6-digit code sent to your mobile/email
            </p>
            <div className="flex justify-center gap-4 mb-6">
                {renderInput('otp', '', 'text', {
                    maxLength: 6,
                    className: `w-32 p-2 text-center text-2xl border rounded-lg focus:ring-2 focus:ring-blue-500 
                        ${errors.otp ? 'border-red-500' : 'border-gray-300'}`
                })}
            </div>
            <p className="text-sm text-gray-500 text-center">
                Didn't receive the code or entered wrong email?
                <button
                    onClick={() => setStep(1)}
                    className="ml-1 text-blue-600 hover:text-blue-800 font-medium"
                >
                    Go back
                </button>
            </p>
        </div>
    );
};

export default VerificationCode;