import React, { useState } from 'react';

const BusinessDetails = ({ onNext }) => {
    // Initial form state
    const [formData, setFormData] = useState({
        shopname: '',
        businessCategory: '',
        businessRegistrationNumber: '',
        description: '',
        contact: {
            shopphoneNo: '',
            shopemail: ''
        },
        street: '',
        city: '',
        postalCode: '',
        country: '',
        establishedDate: ''
    });

    // Error state
    const [errors, setErrors] = useState({});

    // Validation functions
    const validateField = (name, value) => {
        switch (name) {
            case 'shopname':
                return /^[A-Za-z\s]+$/.test(value) ? '' : 'Business name must contain only letters';

            case 'businessCategory':
                return value ? '' : 'Please select a business category';

            case 'businessRegistrationNumber':
                return value ? '' : 'Business registration number is required';

            case 'description':
                return value.length >= 20 ? '' : 'Description must be at least 20 characters';

            case 'contact.shopphoneNo':
                return /^\d{10}$/.test(value) ? '' : 'Phone number must be 10 digits';

            case 'contact.shopemail':
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Invalid email address';

            case 'street':
                return value ? '' : 'Street address is required';

            case 'city':
                return /^[A-Za-z\s]+$/.test(value) ? '' : 'City must contain only letters';

            case 'postalCode':
                return /^\d{6}$/.test(value) ? '' : 'Postal code must be exactly 6 digits';

            case 'country':
                return /^[A-Za-z\s]+$/.test(value) ? '' : 'Country must contain only letters';

            case 'establishedDate':
                return value ? (new Date(value) <= new Date() ? '' : 'Established date cannot be in the future') : 'Established date is required';

            default:
                return '';
        }
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Handle nested contact fields
        if (name.startsWith('contact.')) {
            const contactField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                contact: {
                    ...prev.contact,
                    [contactField]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // Validate entire form
    const validateForm = () => {
        const newErrors = {};

        // Validate each field
        Object.keys(formData).forEach(key => {
            if (key === 'contact') {
                // Validate contact fields
                Object.keys(formData.contact).forEach(contactKey => {
                    const error = validateField(`contact.${contactKey}`, formData.contact[contactKey]);
                    if (error) {
                        newErrors[`contact.${contactKey}`] = error;
                    }
                });
            } else {
                const error = validateField(key, formData[key]);
                if (error) {
                    newErrors[key] = error;
                }
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
            <h2 className="text-xl font-semibold mb-4">Business Details</h2>

            {/* Business Name */}
            <div>
                <label htmlFor="shopname" className="block text-sm font-medium text-gray-700">
                    Business Name
                </label>
                <input
                    type="text"
                    name="shopname"
                    value={formData.shopname}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-lg 
                        ${errors.shopname ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.shopname && <p className="mt-1 text-sm text-red-500">{errors.shopname}</p>}
            </div>

            {/* Business Category */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Category/Type
                </label>
                <select
                    name="businessCategory"
                    value={formData.businessCategory}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-lg 
                        ${errors.businessCategory ? 'border-red-500' : 'border-gray-300'}`}
                >
                    <option value="">Select category</option>
                    <option value="retail">Retail</option>
                    <option value="wholesale">Wholesale</option>
                    <option value="service">Service</option>
                </select>
                {errors.businessCategory && <p className="mt-1 text-sm text-red-500">{errors.businessCategory}</p>}
            </div>

            {/* Business Registration Number */}
            <div>
                <label htmlFor="businessRegistrationNumber" className="block text-sm font-medium text-gray-700">
                    Business Registration Number
                </label>
                <input
                    type="text"
                    name="businessRegistrationNumber"
                    value={formData.businessRegistrationNumber}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-lg 
                        ${errors.businessRegistrationNumber ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.businessRegistrationNumber && <p className="mt-1 text-sm text-red-500">{errors.businessRegistrationNumber}</p>}
            </div>

            {/* Business Description */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Business Description
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className={`w-full p-2 border rounded-lg 
                        ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
            </div>

            {/* Contact Section */}
            <div className="border border-gray-100 rounded-lg p-4 bg-white shadow-sm space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    Contact Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    {/* Phone Number */}
                    <div>
                        <label htmlFor="contact.shopphoneNo" className="block text-sm font-medium text-gray-700">
                            Business Phone No
                        </label>
                        <input
                            type="text"
                            name="contact.shopphoneNo"
                            value={formData.contact.shopphoneNo}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded-lg 
                                ${errors['contact.shopphoneNo'] ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors['contact.shopphoneNo'] && <p className="mt-1 text-sm text-red-500">{errors['contact.shopphoneNo']}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="contact.shopemail" className="block text-sm font-medium text-gray-700">
                            Business Email
                        </label>
                        <input
                            type="email"
                            name="contact.shopemail"
                            value={formData.contact.shopemail}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded-lg 
                                ${errors['contact.shopemail'] ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors['contact.shopemail'] && <p className="mt-1 text-sm text-red-500">{errors['contact.shopemail']}</p>}
                    </div>
                </div>
            </div>

            {/* Address Section */}
            <div className="border border-gray-100 rounded-lg p-4 bg-white shadow-sm space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    Address Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    {/* Street */}
                    <div>
                        <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                            Street Address
                        </label>
                        <input
                            type="text"
                            name="street"
                            value={formData.street}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded-lg 
                                ${errors.street ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.street && <p className="mt-1 text-sm text-red-500">{errors.street}</p>}
                    </div>

                    {/* City */}
                    <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                            City
                        </label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded-lg 
                                ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
                    </div>

                    {/* Postal Code */}
                    <div>
                        <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                            Postal Code
                        </label>
                        <input
                            type="text"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded-lg 
                                ${errors.postalCode ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.postalCode && <p className="mt-1 text-sm text-red-500">{errors.postalCode}</p>}
                    </div>

                    {/* Country */}
                    <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                            Country
                        </label>
                        <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded-lg 
                                ${errors.country ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.country && <p className="mt-1 text-sm text-red-500">{errors.country}</p>}
                    </div>
                </div>
            </div>

            {/* Established Date */}
            <div>
                <label htmlFor="establishedDate" className="block text-sm font-medium text-gray-700">
                    Business Established Date
                </label>
                <input
                    type="date"
                    name="establishedDate"
                    value={formData.establishedDate}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-lg 
                        ${errors.establishedDate ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.establishedDate && <p className="mt-1 text-sm text-red-500">{errors.establishedDate}</p>}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
            >
                Next
            </button>
        </form>
    );
};

export default BusinessDetails;