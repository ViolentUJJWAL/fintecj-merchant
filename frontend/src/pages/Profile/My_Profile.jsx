import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import shopServices from "../../services/shopServices";
import LoadingPage from "../Loading/Loading";
import {
  ChevronLeft,
  Pencil,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Building2,
  FileText,
  Receipt,
  CreditCard,  // Replace BankCard with CreditCard
  List
} from "lucide-react";
import profileService from "../../services/profileService";
import { setUserData } from "../../Redux/authSlice/authSlice";
import { setShop } from "../../Redux/dataSlice/dataSlice";
import DocumentVerificationPage from "./Documents";
import { toast } from 'react-toastify'

const MerchantProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth);
  const [shopData, setShopData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("user", user)

  const [formData, setFormData] = useState({
    merchantName: "",
    accountDetails: {
      name: "",
      email: "",
      phone: "",
      address: {
        street: "",
        city: "",
        postalCode: "",
        country: ""
      }
    },
    businessDetails: {
      name: "",
      category: "",
      registrationNumber: "",
      address: ""
    },
    bankInformation: {
      branchCode: "",
      accountType: "",
      accountHolder: "",
      bankName: "",
      branchName: "",
      accountNumber: ""
    },
    documents: {
      govId: {
        url: "",
        public_id: ""
      },
      businessLicense: {
        url: "",
        public_id: ""
      },
      taxDocument: {
        url: "",
        public_id: ""
      }
    },
    payoutBalance: 0,

  });

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const shop = await shopServices.getMyShop();
        setShopData(shop);

        setFormData({
          merchantName: user.name,
          accountDetails: {
            name: user.name,
            email: user.email,
            phone: user.phoneNo,
            address: {
              street: user.address?.street || "",
              city: user.address?.city || "",
              postalCode: user.address?.postalCode || "",
              country: user.address?.country || ""
            }
          },
          businessDetails: {
            name: shop?.name || "",
            category: shop?.businessCategory || "",
            registrationNumber: shop?.businessRegistrationNumber || "",
            address: `${shop?.address?.city}, ${shop?.address?.country}, ${shop?.address?.postalCode}, ${shop?.address?.street}` || ""
          },
          bankInformation: {
            branchCode: user.bankInformation?.branchCode || "",
            accountType: user.bankInformation?.accountType || "",
            accountHolder: user.bankInformation?.accountHolder || "",
            bankName: user.bankInformation?.bankName || "",
            branchName: user.bankInformation?.branchName || "",
            accountNumber: user.bankInformation?.accountNumber || ""
          },
          documents: {
            govId: {
              url: user.govId?.url || "",
              public_id: user.govId?.public_id || ""
            },
            businessLicense: {
              url: user.businessLicense?.url || "",
              public_id: user.businessLicense?.public_id || ""
            },
            taxDocument: {
              url: user.taxDocument?.url || "",
              public_id: user.taxDocument?.public_id || ""
            },
            profile: {
              url: user.profile?.url || "",
              public_id: user.profile?.public_id || ""
            }
          },
          payoutBalance: user.payoutBalance || 0,

        });
      } catch (err) {
        setError("Failed to fetch shop details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchShopData();
    }
  }, [user]);

  const [editableFields, setEditableFields] = useState({});
  const [profileImage, setProfileImage] = useState(() =>
    user?.profile?.url || "/api/placeholder/120/120"
  );


  const handleEdit = (section, field) => {
    setEditableFields((prev) => ({
      ...prev,
      [`${section}.${field}`]: !prev[`${section}.${field}`],
    }));
  };

  const handleInputChange = (section, field, value) => {
    setFormData((prev) => {
      // Handle nested objects like address
      if (section.includes('.')) {
        const [mainSection, subSection] = section.split('.');
        return {
          ...prev,
          [mainSection]: {
            ...prev[mainSection],
            [subSection]: {
              ...prev[mainSection][subSection],
              [field]: value
            }
          }
        };
      }

      // Handle top-level and direct nested objects
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      };
    });
  };
  const handleSave = async () => {
    try {
      setLoading(true)
      const merchantData = {
        name: formData.accountDetails.name,
        email: formData.accountDetails.email,
        phoneNo: formData.accountDetails.phone,
        address: {
          street: formData.accountDetails.address.street,
          city: formData.accountDetails.address.city,
          postalCode: formData.accountDetails.address.postalCode,
          country: formData.accountDetails.address.country
        },
        bankInformation: {
          branchCode: formData.bankInformation.branchCode,
          accountType: formData.bankInformation.accountType,
          accountHolder: formData.bankInformation.accountHolder,
          bankName: formData.bankInformation.bankName,
          branchName: formData.bankInformation.branchName,
          accountNumber: formData.bankInformation.accountNumber
        }
      };

      const shopData = {
        name: formData.businessDetails.name,
        businessCategory: formData.businessDetails.category,
        address: {
          street: formData.accountDetails.address.street,
          city: formData.accountDetails.address.city,
          postalCode: formData.accountDetails.address.postalCode,
          country: formData.accountDetails.address.country
        },
        businessRegistrationNumber: formData.businessDetails.registrationNumber
      };

      const response = await profileService.updateMerchantAndShop(merchantData, shopData);
      console.log(response)
      dispatch(setUserData({ user: response.merchant }));
      dispatch(setShop({ shop: response.shop }));

      toast.success("Profile updated successfully!");
      setEditableFields({});
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setLoading(false)
    }
  };


  const EditableField = ({ section, field, label, icon: Icon, value, type = "text" }) => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleEdit(section, field);
      }
    };

    return (
      <div className="relative flex items-center p-4 bg-gray-50 rounded-lg mb-3">
        <Icon className="w-5 h-5 text-gray-500 mr-3" />
        <div className="flex-1">
          <div className="text-sm text-gray-500 mb-1">{label}</div>
          {editableFields[`${section}.${field}`] ? (
            <input
              type={type}
              value={value}
              onChange={(e) => handleInputChange(section, field, e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-white border rounded px-2 py-1"
              autoFocus
            />
          ) : (
            <div
              className="text-gray-900 cursor-pointer"
              onClick={() => handleEdit(section, field)}
            >
              {value}
            </div>
          )}
        </div>
        <button
          onClick={() => handleEdit(section, field)}
          className="p-2 hover:bg-gray-200 rounded-full ml-2"
        >
          <Pencil className="w-4 h-4 text-blue-600" />
        </button>
      </div>
    );
  };

  if (loading) {
    return <LoadingPage layout="sidebar" />;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 lg:p-8">
      <button
        className="flex items-center text-blue-500 hover:text-blue-700 mb-6"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft className="w-6 h-6" />
        <span>Back</span>
      </button>

      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <img
            src={profileImage}
            alt="Profile"
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover"
          />

        </div>
      </div>

      <h1 className="text-xl sm:text-2xl font-bold text-center mb-8">
        {formData.merchantName}
      </h1>

      <div className="mb-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">
          Account Details
        </h2>
        <EditableField
          section="accountDetails"
          field="name"
          label="Full Name"
          icon={User}
          value={formData.accountDetails.name}
        />
        <EditableField
          section="accountDetails"
          field="email"
          label="Email"
          icon={Mail}
          value={formData.accountDetails.email}
        />
        <EditableField
          section="accountDetails"
          field="phone"
          label="Phone"
          icon={Phone}
          value={formData.accountDetails.phone}
        />

        <div className="bg-gray-50 p-4 rounded-lg mb-3">
          <h3 className="text-md font-semibold mb-3 flex items-center">
            <MapPin className="w-5 h-5 text-gray-500 mr-2" />
            Address Details
          </h3>
          <EditableField
            section="accountDetails.address"
            field="street"
            label="Street"
            icon={MapPin}
            value={formData.accountDetails.address.street}
          />
          <EditableField
            section="accountDetails.address"
            field="city"
            label="City"
            icon={Building2}
            value={formData.accountDetails.address.city}
          />
          <EditableField
            section="accountDetails.address"
            field="postalCode"
            label="Postal Code"
            icon={List}
            value={formData.accountDetails.address.postalCode}
          />
          <EditableField
            section="accountDetails.address"
            field="country"
            label="Country"
            icon={Building2}
            value={formData.accountDetails.address.country}
          />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">
          Business Details
        </h2>
        <EditableField
          section="businessDetails"
          field="name"
          label="Business Name"
          icon={Building2}
          value={formData.businessDetails.name}
        />
        <EditableField
          section="businessDetails"
          field="category"
          label="Business Category"
          icon={Briefcase}
          value={formData.businessDetails.category}
        />
        <EditableField
          section="businessDetails"
          field="registrationNumber"
          label="Registration Number"
          icon={FileText}
          value={formData.businessDetails.registrationNumber}
        />
      </div>

      <div className="mb-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">
          Bank Information
        </h2>
        <EditableField
          section="bankInformation"
          field="branchCode"
          label="Branch Code"
          icon={CreditCard}
          value={formData.bankInformation.branchCode}
        />
        <EditableField
          section="bankInformation"
          field="accountType"
          label="Account Type"
          icon={CreditCard}  // Changed from BankCard to CreditCard
          value={formData.bankInformation.accountType}
        />
        <EditableField
          section="bankInformation"
          field="accountHolder"
          label="Account Holder Name"
          icon={User}
          value={formData.bankInformation.accountHolder}
        />
        <EditableField
          section="bankInformation"
          field="bankName"
          label="Bank Name"
          icon={Building2}
          value={formData.bankInformation.bankName}
        />
        <EditableField
          section="bankInformation"
          field="branchName"
          label="Branch Name"
          icon={Building2}
          value={formData.bankInformation.branchName}
        />
        <EditableField
          section="bankInformation"
          field="accountNumber"
          label="Account Number"
          icon={CreditCard}
          value={formData.bankInformation.accountNumber}
        />
      </div>

      <div className="mb-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">
          Additional Information
        </h2>
        <div className="bg-gray-50 p-4 rounded-lg mb-3 flex justify-between items-center">
          <div className="flex items-center">
            <List className="w-5 h-5 text-gray-500 mr-3" />
            <span>Payout Balance</span>
          </div>
          <span className="font-bold">${formData.payoutBalance.toFixed(2)}</span>
        </div>


      </div>

      <div className="mb-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">
          Documents
        </h2>
        <div className="bg-gray-50 p-4 rounded-lg mb-3 flex justify-between items-center">

          <DocumentVerificationPage documents={formData.documents} />

        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >   Save Changes</button>
      </div>
    </div>
  );
};

export default MerchantProfile;
