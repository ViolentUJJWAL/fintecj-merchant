import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/authServices';
import { Rotate3D } from 'lucide-react';


const ProgressStep = ({ active, completed, first, last }) => (
    <div className="flex items-center">
        <div className={`w-3 h-3 rounded-full ${active ? 'bg-blue-900' :
            completed ? 'bg-blue-900' : 'bg-gray-300'
            }`} />
        {!last && (
            <div className={`w-20 h-0.5 ${completed ? 'bg-blue-900' : 'bg-gray-300'
                }`} />
        )}
    </div>
);

const SellerRegistration = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const totalSteps = 5;

    const [sellerData, setSellerData] = useState({
        name: 'Aman',
        email: 'ujjwal21aman08@gmail.com',
        phoneNo: '74125896325',
        otp: '',
    });
    const [shopData, setShopData] = useState({
        shopname: 'codedv',
        businessCategory: 'jhg',
        businessRegistrationNumber: 'DFGHJYT8558',
        description: 'huiwe iiewg8ef ueigwe uyf',
        shopaddress: {
            street: '',
            city: '',
            postalCode: '',
            country: '',
        },
        contact: {
            shopphoneNo: '741589632585',
            shopemail: 'kequ@osjui.com',
        },
        establishedDate: '11/05/2004',
    });

    const [bankData, setBankData] = useState({
        merchantaddress: {
            merchantstreet: '',
            merchantcity: '',
            merchantpostalCode: '',
            merchantcountry: '',
        },
        branchCode: '741258',
        accountType: 'kuyvuigo',
        accountHolder: 'kjvyu bivuvuy',
        bankName: 'kyuivy',
        branchName: 'lkiuug',
        accountNumber: '7412586325874',
        govId: null,
        businessLicense: null,
        taxDocument: null,
        profile: null,
        socialMediaLink: '',
        agreedToTerms: false,

    });


    const [formData, setFormData] = useState({
        ...sellerData,
        ...shopData,
        ...bankData
    });

    const [useShopaddress, setUseShopaddress] = useState(false);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

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

    const validateField = (field, value) => {
        let error = '';
        switch (field) {
            // Seller Deatils
            case 'name':
                if (!value.trim()) error = 'Full name is required';
                else if (value.length < 2) error = 'Name must be at least 2 characters';
                else if (!/^[a-zA-Z\s]*$/.test(value)) error = 'Name can only contain letters';
                break;
            case 'email':
                if (!value) error = 'Email is required';
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Invalid email format';
                break;
            case 'phoneNo':
                if (!value) error = 'Phone number is required';
                else if (!/^\d{10,15}$/.test(value)) error = 'Phone number must be 10 to 15 digits digits';
                break;
            case 'otp':
                if (!value) error = 'Verification code is required';
                else if (!/^\d{6}$/.test(value)) error = 'Code must be 6 digits';
                const handleInputChange = (event) => {
                    const { name, value } = event.target;

                    // Allow only numbers for OTP
                    const sanitizedValue = name === 'otp' ? value.replace(/\D/g, '') : value;

                    setFormValues((prevValues) => ({
                        ...prevValues,
                        [name]: sanitizedValue,
                    }));
                };

                break;
            // shop details
            case 'shopname':
                if (!value) error = 'Business name is required';
                break;
            case 'businessCategory':
                if (!value) error = 'Please select a business category';
                break;
            case 'businessRegistrationNumber':
                if (!value.trim()) error = 'Registration number is required';
                break;
            case 'description':
                if (!value.trim()) error = 'Business description is required';
                break;
            case 'shopaddress':
                if (!value || Object.values(value).some((subValue) => !subValue.trim())) {
                    error = 'All address fields are required.';
                }
                break;

            case 'street':
                if (!value.trim()) {
                    error = 'Street address is required.';
                } else if (value.length < 3) {
                    error = 'Street address must be at least 3 characters.';
                }
                break;

            case 'city':
                if (!value.trim()) {
                    error = 'City is required.';
                } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                    error = 'City name must contain only letters.';
                }
                break;

            case 'postalCode':
                if (!value.trim()) {
                    error = 'Postal code is required.';
                } else if (!/^\d{4,10}$/.test(value)) {
                    error = 'Postal code must be between 4 to 10 digits.';
                }
                break;

            case 'country':
                if (!value.trim()) {
                    error = 'Country is required.';
                } else if (value.length < 2) {
                    error = 'Country name must be at least 2 characters.';
                }
                break;


            // case 'contact':
            //     if (!value) error = 'Phone number is required';
            //     else if (!/^\d{10,15}$/.test(value)) error = 'Phone number must be 10 to 15 digits';
            //     break;

            case 'shopphoneNo':
                if (!value) error = 'Phone number is required';
                else if (!/^\d{10,15}$/.test(value)) error = 'shop Phone number must be 10 to 15 digits';
                break;

            case 'shopemail':
                if (!value) error = 'Email is required';
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Invalid email format';
                break;

            case 'establishedDate':
                if (!value) {
                    error = 'Date is required';
                } else {
                    const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD
                    if (!dateRegex.test(value)) {
                        error = 'Date must be in YYYY-MM-DD format';
                    }

                }
                break;
            // Bank account details
            case 'merchantaddress':
                if (!value || Object.values(value).some((field) => !field.trim())) {
                    error = 'All address fields are required.';
                }
                break;
            case 'merchantstreet':
                if (!value.trim()) error = 'Street address is required.';
                break;
            case 'merchantcity':
                if (!value.trim()) error = 'City is required.';
                break;
            case 'merchantpostalCode':
                if (!value) error = 'Postal code is required.';
                else if (!/^\d{4,10}$/.test(value)) error = 'Invalid postal code.';
                break;
            case 'merchantcountry':
                if (!value.trim()) error = 'Country is required.';
                break;


            case 'branchCode':
                if (!value) {
                    error = 'Branch code is required';
                } else if (!/^\d{6}$/.test(value)) {
                    error = 'Invalid branch code. Must be exactly 6 digits.';
                } else {
                    error = '';
                }
                break;

            case 'accountName':
                if (!value.trim()) error = ' Account name is required';
                break;
            case 'accountHolder':
                if (!value.trim()) error = 'Account holder name is required';
                break;
            case 'bankName':
                if (!value.trim()) error = 'Bank Account name is required';
                break;
            case 'branchName':
                if (!value.trim()) error = 'Branch  name is required';
                break;
            case 'accountNumber':
                if (!value) error = 'Bank account number is required';
                else if (!/^\d{9,18}$/.test(value)) error = 'Invalid account number';
                break;
            case 'socialMediaLink':
                if (value && !/^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/.test(value)) {
                    error = 'Invalid URL format';
                }
                break;
            default:
                break;
        }
        return error;
    };

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        const error = validateField(field, formData[field]);
        setErrors(prev => ({ ...prev, [field]: error }));
    };

    const updateForm = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setBankData((prev) => ({ ...prev, [field]: value }));
        if (touched[field]) {
            const error = validateField(field, value);
            setErrors(prev => ({ ...prev, [field]: error }));
        }
    };

    // Handle checkbox toggle
    const handleCheckboxChange = () => {
        setUseShopaddress((prev) => !prev);
        if (!useShopaddress) {
            setFormData((prev) => ({
                ...prev,
                merchantaddress: {
                    merchantstreet: prev.shopaddress.street,
                    merchantcity: prev.shopaddress.city,
                    merchantpostalCode: prev.shopaddress.postalCode,
                    merchantcountry: prev.shopaddress.country,
                },
            }));
        }
    };

    const handleSubmit = () => {
        if (validateForm()) {
            console.log('Form submitted successfully:', formData);
            // Proceed to next page
        } else {
            console.log('Form contains errors:', errors);
        }
    };



    const validateStep = () => {
        const stepFields = {
            1: ['name', 'email', 'phoneNo'],
            2: ['otp'],
            3: ['shopname', 'businessCategory', 'businessRegistrationNumber', 'description', 'shopaddress', 'contact', 'establishedDate'],
            4: ['address', 'branchCode', 'accountName', 'accountHolder', 'bankName', 'branchName', 'accountNumber'],
            5: ['agreedToTerms']
        };

        const fieldsToValidate = stepFields[step];
        const newErrors = {};
        let isValid = true;

        fieldsToValidate.forEach(field => {
            const error = validateField(field, formData[field]);
            if (error) {
                console.log("in func", error)
                newErrors[field] = error;
                isValid = false;
            }
        });


        if (step === 5 && !formData.agreedToTerms) {
            newErrors.agreedToTerms = 'You must agree to the terms and conditions';
            isValid = false;
        }

        setErrors(prev => ({ ...prev, ...newErrors }));
        return isValid;
    };

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
                onChange={(e) => updateForm("shopaddress", {
                    ...formData.shopaddress,
                    [field]: e.target.value // Use bracket notation to update the correct field
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

    const renderBasicInfo = () => (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            {renderInput('name', 'Full Name')}
            {renderInput('phoneNo', 'Phone No', 'tel')}
            {renderInput('email', 'Email Address', 'email')}

        </div>

    );


    const renderVerificationCode = () => (
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


    const renderBusinessDetails = () => (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Business Details</h2>
            {renderInput('shopname', 'Business Name')}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Category/Type
                </label>
                <select
                    value={formData.businessCategory}
                    onChange={(e) => updateForm('businessCategory', e.target.value)}
                    onBlur={() => handleBlur('businessCategory')}
                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 
                        ${errors.businessCategory ? 'border-red-500' : 'border-gray-300'}`}
                >
                    <option value="">Select category</option>
                    <option value="retail">Retail</option>
                    <option value="wholesale">Wholesale</option>
                    <option value="service">Service</option>
                </select>
                {errors.businessCategory && touched.businessCategory && (
                    <p className="mt-1 text-sm text-red-500">{errors.businessCategory}</p>
                )}
            </div>
            {renderInput('businessRegistrationNumber', 'Business Registration Number')}
            <div className="flex flex-col items-left">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Business Description
                </h3>

                <div>
                    <textarea
                        id="description"
                        name="description"
                        placeholder="Write your business description here..."
                        onChange={(e) => updateForm('description', e.target.value)}
                        value={formData.description}
                        rows="4"
                        className="w-full border border-gray-300 rounded-md p-2 text-sm text-gray-700"
                    />
                </div>
            </div>


            <div className="border border-gray-100 rounded-lg p-4 bg-white shadow-sm space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Address Details</h3>
                <div className="grid grid-cols-2 gap-4">
                    {renderAddressInput('street', 'Street Address', { className: 'text-sm' })}
                    {renderAddressInput('city', 'City', { className: 'text-sm' })}
                    {renderAddressInput('postalCode', 'Postal Code', { className: 'text-sm' })}
                    {renderAddressInput('country', 'Country', { className: 'text-sm' })}
                </div>
            </div>


            <div className="border border-gray-100 rounded-lg p-4 bg-white shadow-sm space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Contact</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="form-group space-y-2">
                        <label htmlFor="shopphoneNo" className="text-sm text-gray-700">Business Phone No</label>
                        <input
                            type="text"
                            id="shopphoneNo"
                            name="shopphoneNo"
                            value={formData.contact.shopphoneNo}
                            onChange={(e) => updateForm('contact', { ...formData.contact, shopphoneNo: e.target.value })}
                            placeholder="Enter your business phone number"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="form-group space-y-2">
                        <label htmlFor="shopemail" className="text-sm text-gray-700">Business Email</label>
                        <input
                            type="email"
                            id="shopemail"
                            name="shopemail"
                            value={formData.contact.shopemail}
                            onChange={(e) => updateForm('contact', { ...formData.contact, shopemail: e.target.value })}
                            placeholder="Enter your business email"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>
            </div>



            <div className="form-group space-y-2">
                <label htmlFor="establishedDate" className="text-sm text-gray-700">Business Established Date</label>
                <input
                    type="date"
                    id="establishedDate"
                    name="establishedDate"
                    value={formData.establishedDate}
                    onChange={(e) => setFormData({ ...formData, establishedDate: e.target.value })}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors.establishedDate && <p className="text-red-500 text-xs">{errors.establishedDate}</p>}
            </div>
        </div>
    );


    const renderDocuments = () => (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Verification Documents</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Government Issued ID */}
                <div className="border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition duration-300">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Government Issued ID</label>
                    <div className="relative">
                        <input
                            type="file"
                            id="govId"
                            onChange={(e) => updateForm('govId', e.target.files[0])}
                            accept="image/*,application/pdf"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <button
                            type="button"
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm text-gray-700 bg-gray-50 hover:bg-gray-100"
                        >
                            Choose File
                        </button>
                    </div>
                    {bankData.govId && (
                        <div className="mt-2 text-sm text-green-600">
                            <p>Selected: {bankData.govId.name}</p>
                            {bankData.govId.type.startsWith('image/') && (
                                <img
                                    src={URL.createObjectURL(bankData.govId)}
                                    alt="Preview"
                                    className="mt-2 w-20 h-20 object-cover border rounded"
                                />
                            )}
                            {bankData.govId.type === 'application/pdf' && (
                                <embed
                                    src={URL.createObjectURL(bankData.govId)}
                                    type="application/pdf"
                                    className="mt-2 w-full h-20"
                                />
                            )}
                        </div>
                    )}
                </div>

                {/* Business License */}
                <div className="border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition duration-300">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business License</label>
                    <div className="relative">
                        <input
                            type="file"
                            id="businessLicense"
                            onChange={(e) => updateForm('businessLicense', e.target.files[0])}
                            accept="image/*,application/pdf"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <button
                            type="button"
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm text-gray-700 bg-gray-50 hover:bg-gray-100"
                        >
                            Choose File
                        </button>
                    </div>
                    {bankData.businessLicense && (
                        <div className="mt-2 text-sm text-green-600">
                            <p>Selected: {bankData.businessLicense.name}</p>
                            {bankData.businessLicense.type.startsWith('image/') && (
                                <img
                                    src={URL.createObjectURL(bankData.businessLicense)}
                                    alt="Preview"
                                    className="mt-2 w-20 h-20 object-cover border rounded"
                                />
                            )}
                            {bankData.businessLicense.type === 'application/pdf' && (
                                <embed
                                    src={URL.createObjectURL(bankData.businessLicense)}
                                    type="application/pdf"
                                    className="mt-2 w-full h-20"
                                />
                            )}
                        </div>
                    )}
                </div>

                {/* Tax Documents */}
                <div className="border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition duration-300">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tax Documents</label>
                    <div className="relative">
                        <input
                            type="file"
                            id="taxDocument"
                            onChange={(e) => updateForm('taxDocument', e.target.files[0])}
                            accept="image/*,application/pdf"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <button
                            type="button"
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm text-gray-700 bg-gray-50 hover:bg-gray-100"
                        >
                            Choose File
                        </button>
                    </div>
                    {bankData.taxDocument && (
                        <div className="mt-2 text-sm text-green-600">
                            <p>Selected: {bankData.taxDocument.name}</p>
                            {bankData.taxDocument.type.startsWith('image/') && (
                                <img
                                    src={URL.createObjectURL(bankData.taxDocument)}
                                    alt="Preview"
                                    className="mt-2 w-20 h-20 object-cover border rounded"
                                />
                            )}
                            {bankData.taxDocument.type === 'application/pdf' && (
                                <embed
                                    src={URL.createObjectURL(bankData.taxDocument)}
                                    type="application/pdf"
                                    className="mt-2 w-full h-20"
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div>
                {/* Merchant Address Section */}
                <div className="border border-gray-100 rounded-lg p-4 bg-white shadow-sm space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                        Merchant Address
                    </h3>
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={useShopaddress}
                            onChange={handleCheckboxChange}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Use Shop Address</span>
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Street Address
                            </label>
                            <input
                                type="text"
                                value={useShopaddress ? formData.shopaddress.street : formData.merchantaddress.merchantstreet}
                                onChange={(e) => updateForm('merchantaddress', {
                                    ...formData.merchantaddress,
                                    merchantstreet: e.target.value
                                })}
                                disabled={useShopaddress}
                                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 
                                    ${errors.merchantstreet ? 'border-red-500' : 'border-gray-300'}
                                    ${useShopaddress ? 'bg-gray-100' : ''}`}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                City
                            </label>
                            <input
                                type="text"
                                value={useShopaddress ? formData.shopaddress.city : formData.merchantaddress.merchantcity}
                                onChange={(e) => updateForm('merchantaddress', {
                                    ...formData.merchantaddress,
                                    merchantcity: e.target.value
                                })}
                                disabled={useShopaddress}
                                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 
                                    ${errors.merchantcity ? 'border-red-500' : 'border-gray-300'}
                                    ${useShopaddress ? 'bg-gray-100' : ''}`}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Postal Code
                            </label>
                            <input
                                type="text"
                                value={useShopaddress ? formData.shopaddress.postalCode : formData.merchantaddress.merchantpostalCode}
                                onChange={(e) => updateForm('merchantaddress', {
                                    ...formData.merchantaddress,
                                    merchantpostalCode: e.target.value
                                })}
                                disabled={useShopaddress}
                                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 
                                    ${errors.merchantpostalCode ? 'border-red-500' : 'border-gray-300'}
                                    ${useShopaddress ? 'bg-gray-100' : ''}`}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Country
                            </label>
                            <input
                                type="text"
                                value={useShopaddress ? formData.shopaddress.country : formData.merchantaddress.merchantcountry}
                                onChange={(e) => updateForm('merchantaddress', {
                                    ...formData.merchantaddress,
                                    merchantcountry: e.target.value
                                })}
                                disabled={useShopaddress}
                                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 
                                    ${errors.merchantcountry ? 'border-red-500' : 'border-gray-300'}
                                    ${useShopaddress ? 'bg-gray-100' : ''}`}
                            />
                        </div>
                    </div>
                </div>
            </div>


            <h2 className="text-lg font-semibold mb-4">Banking Details</h2>

            {renderInput('branchCode', 'Branch Code')}
            {renderInput('accountName', 'Account Type')}
            {renderInput('accountHolder', "Account Holder's Name")}
            {renderInput('bankName', 'Bank  Name')}
            {renderInput('branchName', 'Branch Address')}
            {renderInput('accountNumber', 'Bank Account Number')}
        </div>
    );


    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [stream, setStream] = useState(null);

    const openCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'user', // Use the front-facing camera
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

    const capturePhoto = () => {
        const video = document.getElementById('video-feed');
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const image = canvas.toDataURL('image/png');
        const file = dataURLtoFile(image, 'profile.png');
        updateForm('profile', file);

        closeCamera();
    };

    const closeCamera = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
        }
        setStream(null);
        setIsCameraOpen(false);
    };

    const dataURLtoFile = (dataurl, filename) => {
        const arr = dataurl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    };


    const renderFinalStep = () => (
        <div className="space-y-4">
            <div className="relative flex justify-center mb-6">
                {/* Profile Picture Display */}
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

                {/* Add Button */}
                <button
                    onClick={openCamera}
                    className="absolute top-1/2 left-1/2 bg-blue-500 rounded-full p-2 cursor-pointer h-7 w-7 flex items-center justify-center"
                    style={{
                        transform: 'translate(60%, 45%)', // Centers the icon inside the box
                    }}
                >
                    <span className="text-white text-xl">+</span>
                </button>

                {/* Camera Popup */}
                {isCameraOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-4 relative">
                            {/* Close Button */}
                            <button
                                onClick={closeCamera}
                                className="absolute top-2 right-2 text-red-500 text-xl"
                            >
                                ✕
                            </button>

                            {/* Camera Feed */}
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
                            ></video>

                            {/* Capture Button */}
                            <button
                                onClick={capturePhoto}
                                className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg"
                            >
                                Capture Photo
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {/* Hidden File Input */}
            <input
                type="file"
                id="profile-picture"
                onChange={(e) => updateForm('profile', e.target.files[0])}
                className="hidden"
            />


            <h2 className="text-lg font-semibold text-center mt-4">{formData.name}</h2>
            <p className="text-sm text-gray-600 text-center mb-6">Complete Profile Setup</p>


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
            {errors.agreedToTerms && (
                <p className="mt-1 text-sm text-red-500">{errors.agreedToTerms}</p>
            )}
        </div>
    );

    const renderStep = () => {
        switch (step) {
            case 1:
                return renderBasicInfo();
            case 2:
                return renderVerificationCode();
            case 3:
                return renderBusinessDetails();
            case 4:
                return renderDocuments();
            case 5:
                return renderFinalStep();
            default:
                return null;
        }
    };

    const handleBasicInfoSubmit = async () => {
        try {
            setLoading(true)
            const callSentOpt = await AuthService.sentOtp(formData.name, formData.email, formData.phoneNo)
            console.log(callSentOpt)
            console.log({ name: formData.name, email: formData.email, phone: formData.phoneNo })
            // console.log('Basic info saved:', result);
            setStep(step + 1);
        } catch (error) {
            console.error('Error submitting basic info:', error.message);
            setErrors({ apiError: error.message });
        } finally {
            setLoading(false)
        }
    };


    const handleOtpValidation = async () => {
        try {
            setLoading(true)
            const callCheckOtp = await AuthService.checkOtp(formData.otp)
            console.log(callCheckOtp)
            console.log(formData.otp)
            setStep(step + 1);
        } catch (error) {
            console.error('Error validating OTP:', error.message);
            setErrors({ apiError: error.message });
        } finally {
            setLoading(false)
        }
    };

    const handleFinalSubmit = async () => {
        try {
            setLoading(true);

            console.log(formData)

            // Create FormData object
            const formDataToSend = new FormData();
            formDataToSend.append("businessName", formData.shopname);
            formDataToSend.append("businessCategory", formData.businessCategory);
            formDataToSend.append("businessAddressStreet", formData.shopaddress.street);
            formDataToSend.append("businessAddressCity", formData.shopaddress.city);
            formDataToSend.append("businessAddressPostalCode", formData.shopaddress.postalCode);
            formDataToSend.append("businessAddressCountry", formData.shopaddress.country);
            formDataToSend.append("businessRegistrationNumber", formData.businessRegistrationNumber);
            formDataToSend.append("businessPhoneNo", formData.contact.shopphoneNo);
            formDataToSend.append("businessEmail", formData.contact.shopemail);
            formDataToSend.append("socialMediaLink", formData.socialMediaLink);
            formDataToSend.append("establishedDate", formData.establishedDate);
            formDataToSend.append("businessDescription", formData.description);
            formDataToSend.append("merchantAddressStreet", formData.merchantaddress.merchantstreet);
            formDataToSend.append("merchantAddressCity", formData.merchantaddress.merchantcity);
            formDataToSend.append("merchantAddressPostalCode", formData.merchantaddress.merchantpostalCode);
            formDataToSend.append("merchantAddressCountry", formData.merchantaddress.merchantcountry);
            formDataToSend.append("branchCode", formData.branchCode);
            formDataToSend.append("accountType", formData.accountType);
            formDataToSend.append("accountHolder", formData.accountHolder);
            formDataToSend.append("bankName", formData.bankName);
            formDataToSend.append("branchName", formData.branchName);
            formDataToSend.append("accountNumber", formData.accountNumber);

            // Append file fields
            if (formData.profile instanceof File) formDataToSend.append("profile", formData.profile);
            if (formData.govId instanceof File) formDataToSend.append("govId", formData.govId);
            if (formData.businessLicense instanceof File) formDataToSend.append("businessLicense", formData.businessLicense);
            if (formData.taxDocument instanceof File) formDataToSend.append("taxDocument", formData.taxDocument);

            // Send the request using your AuthService or Axios
            await AuthService.requestForm(formDataToSend);

            // Redirect or perform other actions after successful submission
            navigate('/verification-success');
        } catch (error) {
            console.error('Error completing registration:', error.message);
            setErrors({ apiError: error.message });
        } finally {
            setLoading(false);
        }
    };




    const handleNext = () => {
        console.log("next")
        console.log(validateStep())
        if (validateStep()) {
            console.log(step)
            if (step === 5) {
                handleFinalSubmit()
            } else if (step < totalSteps) {
                console.log(step)
                if (step === 1) {
                    handleBasicInfoSubmit()
                } else if (step === 2) {
                    handleOtpValidation()
                } else {
                    setStep(step + 1);
                    console.log(step)
                }
            }
        }
    };

    const handlePrevious = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    return (
        <>
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

                    <div
                        className={`flex ${step < 4 ? 'justify-end' : 'justify-between'}`}
                    >
                        {step > 3 && (
                            <button
                                onClick={handlePrevious}
                                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                            >
                                Previous
                            </button>
                        )}
                        <button
                            onClick={handleNext}
                            disabled={loading}
                            className={`px-6 py-2 text-white rounded-lg items-center transition-all duration-200 
                                    ${loading
                                    ? 'bg-gray-400 cursor-not-allowed' // Disabled state styles
                                    : 'bg-blue-900 hover:bg-blue-800' // Active state styles
                                } 
                                ${step === 1 ? 'w-full' : ''}`}
                        >
                            {step === 5 ? 'Register' : 'Next'}
                        </button>

                    </div>
                    <div>
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
            </div>

        </>
    );
};

export default SellerRegistration;