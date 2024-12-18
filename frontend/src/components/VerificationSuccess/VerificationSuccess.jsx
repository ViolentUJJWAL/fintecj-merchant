import React from 'react';
import { useNavigate } from 'react-router-dom';

const VerificationSuccess = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md h-[500px] flex flex-col justify-between">
                <div className="flex flex-col items-center text-center space-y-8 pt-12">
                    {/* Success Icon */}
                    <div className="relative">
                        <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center animate-fade-in">
                            <svg
                                className="w-12 h-12 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="3"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                        {/* Decorative Dots */}
                        <div className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-pink-300 animate-bounce delay-100" />
                        <div className="absolute -bottom-1 -left-3 w-2 h-2 rounded-full bg-emerald-300 animate-bounce delay-200" />
                        <div className="absolute top-1 -left-2 w-2 h-2 rounded-full bg-pink-200 animate-bounce delay-300" />
                    </div>

                    {/* Text Content */}
                    <div className="space-y-4 mt-8">
                        <h1 className="text-2xl font-bold text-gray-800">
                            Verification Completed!
                        </h1>
                        <p className="text-gray-600 text-lg">
                            You have successfully completed your merchant verification
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            It may take 5 to 7 days for us to verify your documents
                        </p>
                    </div>
                </div>

                {/* Button - Positioned at bottom */}
                <div className="pb-4">
                    <button
                        className="w-full py-3.5 px-20 bg-blue-600 text-white font-medium rounded-lg
                           hover:bg-blue-700 transition-colors duration-200
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        onClick={() => navigate('/login')} // Navigate to the login page
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerificationSuccess;