import React from 'react';

const Documents = ({ formData, updateForm, useShopaddress, handleCheckboxChange, errors, touched }) => {
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Verification Documents</h2>
            <DocumentUploadSection formData={formData} updateForm={updateForm} />
            <MerchantAddressSection
                formData={formData}
                updateForm={updateForm}
                useShopaddress={useShopaddress}
                handleCheckboxChange={handleCheckboxChange}
                errors={errors}
                touched={touched}
            />
            <BankingDetailsSection
                formData={formData}
                updateForm={updateForm}
                errors={errors}
                touched={touched}
            />
        </div>
    );
};

const DocumentUploadSection = ({ formData, updateForm }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <DocumentUploadField
            label="Government Issued ID"
            id="govId"
            file={formData.govId}
            updateForm={updateForm}
        />
        <DocumentUploadField
            label="Business License"
            id="businessLicense"
            file={formData.businessLicense}
            updateForm={updateForm}
        />
        <DocumentUploadField
            label="Tax Documents"
            id="taxDocument"
            file={formData.taxDocument}
            updateForm={updateForm}
        />
    </div>
);

const DocumentUploadField = ({ label, id, file, updateForm }) => (
    <div className="border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition duration-300">
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <div className="relative">
            <input
                type="file"
                id={id}
                onChange={(e) => updateForm(id, e.target.files[0])}
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
        {file && (
            <FilePreview file={file} />
        )}
    </div>
);

const FilePreview = ({ file }) => (
    <div className="mt-2 text-sm text-green-600">
        <p>Selected: {file.name}</p>
        {file.type.startsWith('image/') && (
            <img
                src={URL.createObjectURL(file)}
                alt="Preview"
                className="mt-2 w-20 h-20 object-cover border rounded"
            />
        )}
        {file.type === 'application/pdf' && (
            <embed
                src={URL.createObjectURL(file)}
                type="application/pdf"
                className="mt-2 w-full h-20"
            />
        )}
    </div>
);

const MerchantAddressSection = ({ formData, updateForm, useShopaddress, handleCheckboxChange, errors, touched }) => (
    <div>
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
                    {errors.merchantstreet && touched.merchantstreet && (
                        <p className="mt-1 text-sm text-red-500">{errors.merchantstreet}</p>
                    )}
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
                    {errors.merchantcity && touched.merchantcity && (
                        <p className="mt-1 text-sm text-red-500">{errors.merchantcity}</p>
                    )}
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
                    {errors.merchantpostalCode && touched.merchantpostalCode && (
                        <p className="mt-1 text-sm text-red-500">{errors.merchantpostalCode}</p>
                    )}
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
                    {errors.merchantcountry && touched.merchantcountry && (
                        <p className="mt-1 text-sm text-red-500">{errors.merchantcountry}</p>
                    )}
                </div>
            </div>
        </div>
    </div>
);

const BankingDetailsSection = ({ formData, updateForm, errors, touched }) => (
    <div className="space-y-4">
        <h2 className="text-lg font-semibold mb-4">Banking Details</h2>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Branch Code
                </label>
                <input
                    type="text"
                    value={formData.branchCode}
                    onChange={(e) => updateForm('branchCode', e.target.value)}
                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 
                        ${errors.branchCode ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.branchCode && touched.branchCode && (
                    <p className="mt-1 text-sm text-red-500">{errors.branchCode}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Type
                </label>
                <input
                    type="text"
                    value={formData.accountName}
                    onChange={(e) => updateForm('accountName', e.target.value)}
                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 
                        ${errors.accountName ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.accountName && touched.accountName && (
                    <p className="mt-1 text-sm text-red-500">{errors.accountName}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Holder's Name
                </label>
                <input
                    type="text"
                    value={formData.accountHolder}
                    onChange={(e) => updateForm('accountHolder', e.target.value)}
                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 
                        ${errors.accountHolder ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.accountHolder && touched.accountHolder && (
                    <p className="mt-1 text-sm text-red-500">{errors.accountHolder}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bank Name
                </label>
                <input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => updateForm('bankName', e.target.value)}
                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 
                        ${errors.bankName ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.bankName && touched.bankName && (
                    <p className="mt-1 text-sm text-red-500">{errors.bankName}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Branch Name
                </label>
                <input
                    type="text"
                    value={formData.branchName}
                    onChange={(e) => updateForm('branchName', e.target.value)}
                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 
                        ${errors.branchName ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.branchName && touched.branchName && (
                    <p className="mt-1 text-sm text-red-500">{errors.branchName}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bank Account Number
                </label>
                <input
                    type="text"
                    value={formData.accountNumber}
                    onChange={(e) => updateForm('accountNumber', e.target.value)}
                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 
                        ${errors.accountNumber ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.accountNumber && touched.accountNumber && (
                    <p className="mt-1 text-sm text-red-500">{errors.accountNumber}</p>
                )}
            </div>
        </div>
    </div>
);

export default Documents;