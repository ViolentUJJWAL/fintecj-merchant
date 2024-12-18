import { useState } from 'react';

export const useSellerForm = () => {
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
        accountName: 'kuyvuigo',
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

    const updateForm = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setBankData(prev => ({ ...prev, [field]: value }));
    };

    return {
        formData,
        setFormData,
        updateForm,
        bankData,
        setBankData
    };
};