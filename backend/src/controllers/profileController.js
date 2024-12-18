const hashPassword = require("../../utils/password");
const Merchant = require("../models/merchantModel");
const bcrypt = require("bcryptjs");
const Shop = require("../models/shopModel");
const { uploadOnCloudinary, deleteOnCloudinary } = require("../../utils/cloudinary");
const mongoose = require("mongoose")



exports.getMerchantById = async (req, res) => {
  try {
    const { id } = req.params
    const user = await Merchant.findById(id, "name email phoneNo businessName businessCategory businessAddress socialMediaLink");
    if (!user) return res.status(404).json({ error: "Merchant not found!" });
    return res.status(200).json({ message: "Get merchant info", data: user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while creating the business.' });
  }
}

exports.getprofile = async (req, res) => {
  try {
    const id = req.user._id
    console.log(id)
    const user = await Merchant.findById(id);
    if (!user) return res.status(404).json({ error: "Merchant not found!" });
    const decryptData = await user.decryptBankInfo()
    user.bankInformation = decryptData.bankInformation
    user.govId = decryptData.document.govId
    user.businessLicense = decryptData.document.businessLicense
    user.taxDocument = decryptData.document.taxDocument
    return res.status(200).json({ message: "Get merchant info", data: user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while creating the business.' });
  }
}

exports.changeMerchantPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body; // Extract passwords from request body
    // Validate inputs
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: "Both old and new passwords are required." });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: "New password must be at least 8 characters long." });
    }
    if (oldPassword === newPassword) {
      return res.status(400).json({ error: "New password and Old Password are same." });
    }

    // Find the merchant by ID
    const merchant = await Merchant.findById(req.user._id).select("+password");
    if (!merchant) {
      return res.status(404).json({ error: "Merchant not found." });
    }

    // Check if the old password matches
    const isMatch = await bcrypt.compare(oldPassword, merchant.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Old password is incorrect." });
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // Update the password in the database
    merchant.password = hashedPassword;
    await merchant.save();

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// Update Merchant and Shop Information
exports.updateMerchantAndShop = async (req, res) => {
  const { merchantData, shopData } = req.body; // Merchant and Shop data from request
  const files = req.files; // Uploaded files

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Fetch Merchant and Shop
    const merchant = await Merchant.findById(req.user._id);
    const shop = await Shop.findOne({ merchantId: merchant._id });

    if (!merchant || !shop) {
      throw new Error("Merchant or Shop not found");
    }

    let isCriticalChange = false;

    // Update Merchant basic info
    const merchantBasicFields = ["name", "email", "phoneNo", "address"];
    merchantBasicFields.forEach((field) => {
      if (merchantData[field] !== undefined) {
        merchant[field] = merchantData[field];
      }
    });

    // Update Merchant critical file-type fields
    const fileFields = ["govId", "businessLicense", "taxDocument"];
    for (const field of fileFields) {
      if (files && files[field]) {
        // Delete old file from storage
        if (merchant[field]?.public_id) {
          await deleteOnCloudinary(merchant[field].public_id);
        }

        // Upload new file
        const uploadedFile = await uploadOnCloudinary(files[field][0]); // Assuming multer is used
        merchant[field] = {
          url: uploadedFile.secure_url,
          public_id: uploadedFile.public_id,
        };

        isCriticalChange = true;
      }
    }

    // Update Merchant critical info (non-file fields)
    const merchantCriticalFields = ["bankInformation"];
    merchantCriticalFields.forEach((field) => {
      if (merchantData[field] !== undefined) {
        merchant[field] = merchantData[field];
        isCriticalChange = true;
      }
    });

    // Update Shop info
    const shopFields = ["name", "businessCategory", "description", "address", "contact", "establishedDate", "socialMediaLink"];
    shopFields.forEach((field) => {
      if (shopData[field] !== undefined) {
        shop[field] = shopData[field];
      }
    });

    // Check if critical info in Shop is updated
    if (shopData.businessRegistrationNumber) {
      shop.businessRegistrationNumber = shopData.businessRegistrationNumber;
      isCriticalChange = true;
    }

    // If critical info changed, set isVerify to false
    // if (isCriticalChange) {
    //   merchant.isVerify = false;
    // }

    // merchant.govId = {url: "https://res.cloudinary.com/dpnoynz7a/image/upload/v1733127872/j2jrnenl0naogfxlysvz.png", public_id: "j2jrnenl0naogfxlysvz"}
    // merchant.businessLicense = {url: "https://res.cloudinary.com/dpnoynz7a/image/upload/v1733127873/bu4viqunhwhqnyz7lnlm.jpg", public_id: "bu4viqunhwhqnyz7lnlm"}
    // merchant.taxDocument = {url: "https://res.cloudinary.com/dpnoynz7a/image/upload/v1733127874/ghmwvq6cokef2g8rkl6s.jpg", public_id: "ghmwvq6cokef2g8rkl6s"}

    console.log("before",merchant)

    // Save Merchant and Shop
    await merchant.save({ session });
    await shop.save({ session });

    
    
    console.log("after: ",merchant)
    
    // Commit transaction
    await session.commitTransaction();
    session.endSession();
    
    const decryptData = await merchant.decryptBankInfo()
    merchant.bankInformation = decryptData.bankInformation
    merchant.govId = decryptData.document.govId
    merchant.businessLicense = decryptData.document.businessLicense
    merchant.taxDocument = decryptData.document.taxDocument

    console.log("decrypted: ", merchant)

    return res.status(200).json({
      message: "Merchant and Shop information updated successfully",
      merchant,
      shop,
    });
  } catch (error) {
    // Rollback transaction
    console.log(error)
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      message: "Error updating Merchant and Shop information",
      error: error.message,
    });
  }
};
