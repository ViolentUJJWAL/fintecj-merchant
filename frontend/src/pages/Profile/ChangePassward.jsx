import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff } from 'lucide-react';
import profileService from '../../services/profileService';

const ChangePassword = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [passwordVisibility, setPasswordVisibility] = useState({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false
    });

    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear specific error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        // Clear server error and success message
        setServerError('');
        setSuccessMessage('');
    };

    const togglePasswordVisibility = (field) => {
        setPasswordVisibility(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        // Current password validation
        if (!formData.currentPassword.trim()) {
            newErrors.currentPassword = 'Current password is required';
        }

        if (!formData.newPassword.trim()) {
            newErrors.newPassword = 'New password is required';
        } else if (formData.newPassword.length < 8) {
            newErrors.newPassword = 'Password must be at least 8 characters long';
        } else if (formData.newPassword === formData.currentPassword) {
            newErrors.newPassword = 'New password cannot be the same as current password';
        }

        // Confirm password validation
        if (!formData.confirmPassword.trim()) {
            newErrors.confirmPassword = 'Please confirm your new password';
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset previous messages
        setServerError('');
        setSuccessMessage('');
        setIsLoading(true);

        if (validateForm()) {
            try {
                // Call the actual API method to change password
                const response = await profileService.changeMerchantPassword(
                    formData.currentPassword,
                    formData.newPassword
                );

                // Reset form after successful password change
                setFormData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });

                // Set success message
                setSuccessMessage(response.message || 'Password changed successfully');
                navigate(-1)
            } catch (error) {
                // Handle error scenario
                setServerError('Failed to change password');
            } finally {
                setIsLoading(false);
            }
        } else {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full space-y-6">
                <button
                    className="flex items-center mb-4 text-blue-500 hover:text-blue-700"
                    onClick={() => navigate(-1)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    Back
                </button>
                <h2 className="text-2xl font-bold text-center text-gray-800 flex items-center justify-center">
                    <Lock className="mr-2 text-blue-600" size={24} />
                    Change Password
                </h2>

                {/* Server Error Message */}
                {serverError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        {serverError}
                    </div>
                )}

                {/* Success Message */}
                {successMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                        {successMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Current Password Input */}
                    <div>
                        <label htmlFor="currentPassword" className="block text-gray-700 mb-2">
                            Current Password
                        </label>
                        <div className="relative">
                            <input
                                type={passwordVisibility.currentPassword ? 'text' : 'password'}
                                id="currentPassword"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.currentPassword
                                    ? 'border-red-500 focus:ring-red-300'
                                    : 'border-gray-300 focus:ring-blue-300'
                                    }`}
                                placeholder="Enter current password"
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('currentPassword')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            >
                                {passwordVisibility.currentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {errors.currentPassword && (
                            <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
                        )}
                    </div>

                    {/* New Password Input */}
                    <div>
                        <label htmlFor="newPassword" className="block text-gray-700 mb-2">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={passwordVisibility.newPassword ? 'text' : 'password'}
                                id="newPassword"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.newPassword
                                    ? 'border-red-500 focus:ring-red-300'
                                    : 'border-gray-300 focus:ring-blue-300'
                                    }`}
                                placeholder="Enter new password"
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('newPassword')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            >
                                {passwordVisibility.newPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {errors.newPassword && (
                            <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                        )}
                    </div>

                    {/* Confirm New Password Input */}
                    <div>
                        <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <input
                                type={passwordVisibility.confirmPassword ? 'text' : 'password'}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.confirmPassword
                                    ? 'border-red-500 focus:ring-red-300'
                                    : 'border-gray-300 focus:ring-blue-300'
                                    }`}
                                placeholder="Confirm new password"
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('confirmPassword')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            >
                                {passwordVisibility.confirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full text-white py-2 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 ${isLoading
                            ? 'bg-blue-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {isLoading ? 'Changing Password...' : 'Change Password'}
                    </button>
                </form>

                {/* Password Requirements Note */}
                <div className="text-sm text-gray-600 text-center">
                    <p>Password must be at least 8 characters long</p>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;