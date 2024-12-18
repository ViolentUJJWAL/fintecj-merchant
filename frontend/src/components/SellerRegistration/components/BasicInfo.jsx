import React, { useState } from 'react';

const BasicInfo = ({ onNext , loading, handleBasicInfoSubmit}) => {
    // Initial form state
    const [formData, setFormData] = useState({
        name: '',
        phoneNo: '',
        email: ''
    });

    // Error state
    const [errors, setErrors] = useState({});

    // Validation functions
    const validateField = (name, value) => {
        // Check if field is empty first
        if (!value.trim()) {
            return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
        }

        switch(name) {
            case 'name':
                // Name must contain only letters and spaces
                return /^[A-Za-z\s]+$/.test(value) 
                    ? '' 
                    : 'Name must contain only letters';
            
            case 'phoneNo':
                // Phone number must be exactly 10-15 digits
                return /^\d{10,15}$/.test(value) 
                    ? '' 
                    : 'Phone number must be 10-15 digits';
            
            case 'email':
                // Comprehensive email validation
                return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) 
                    ? '' 
                    : 'Invalid email address';
            
            default:
                return '';
        }
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Optional: Clear error for this field as user types
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = {...prev};
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    // Validate entire form
    const validateForm = () => {
        const newErrors = {};
        
        // Validate each field
        Object.keys(formData).forEach(key => {
            const error = validateField(key, formData[key]);
            if (error) {
                newErrors[key] = error;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate form
        if (validateForm()) {
            // If validation passes, proceed to next page
            onNext(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            
            {/* Full Name */}
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-lg 
                        ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Phone Number */}
            <div>
                <label htmlFor="phoneNo" className="block text-sm font-medium text-gray-700">
                    Phone No
                </label>
                <input
                    type="tel"
                    id="phoneNo"
                    name="phoneNo"
                    value={formData.phoneNo}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-lg 
                        ${errors.phoneNo ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.phoneNo && <p className="mt-1 text-sm text-red-500">{errors.phoneNo}</p>}
            </div>

            {/* Email */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-lg 
                        ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>

            {/* Submit Button */}
            <div>
                <button 
                    type="submit" 
                    onClick={handleBasicInfoSubmit}
                    className={`px-6 py-2 text-white rounded-lg items-center transition-all duration-200 w-full 
                        ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-900 hover:bg-blue-800'} `}
                >
                    Next
                </button>
            </div>
        </form>
    );
};

export default BasicInfo;