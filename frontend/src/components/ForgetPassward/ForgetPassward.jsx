import React, { useState } from 'react';
import AuthService from '../../services/authServices';

const ForgetPassword = () => {
    const [emailOrLoginId, setEmailOrLoginId] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Handle password reset email logic here
            await AuthService.forgetPassword(emailOrLoginId)
            setIsSubmitted(true);
        } catch (err) {
            setError('Failed to send reset email. Please try again.');
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
                <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl">
                    <div className="space-y-2">
                        <div className="h-16 w-16 mx-auto bg-green-500 rounded-2xl flex items-center justify-center">
                            <svg
                                className="w-8 h-8 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-center text-gray-900">Check Your Email</h2>
                        <p className="text-center text-gray-600 max-w-sm mx-auto">
                            We've sent a password reset link to your email address. Please check your inbox and follow the instructions.
                        </p>
                    </div>

                    <button
                        onClick={() => window.location.href = '/login'}
                        className="w-full px-4 py-3 text-white bg-blue-600 rounded-xl hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 font-medium"
                    >
                        Return to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl">
                <div className="space-y-2">
                    <div className="h-16 w-16 mx-auto bg-blue-600 rounded-2xl flex items-center justify-center">
                        <svg
                            className="w-10 h-10 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-center text-gray-900">Forgot Password?</h2>
                    <p className="text-center text-gray-600">
                        Enter your <strong>Email address or Login id</strong> to reset your password
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="relative">
                            <input
                                id="emailOrLoginId"
                                type="text"
                                required
                                value={emailOrLoginId}
                                onChange={(e) => setEmailOrLoginId(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                                placeholder="Email address or Login id"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 rounded-xl">
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full px-4 py-3 text-white bg-blue-600 rounded-xl hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 font-medium"
                    >
                        Send Reset Link
                    </button>
                </form>

                <button
                    onClick={() => window.location.href = '/login'}
                    className="w-full px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 focus:ring-4 focus:ring-gray-200 transition-all duration-200 font-medium"
                >
                    Back to Login
                </button>
            </div>
        </div>
    );
};

export default ForgetPassword;