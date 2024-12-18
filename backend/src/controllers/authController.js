const sendEmail = require("../../utils/sendMail");
const hashPassword = require("../../utils/password")
const generateToken = require("../../utils/generateToken");
const bcrypt = require("bcryptjs");
const { encrypt, decrypt } = require("../../utils/cryptoFunc");
const crypto = require('crypto');
const jwt = require("jsonwebtoken");
const Merchant = require("../models/merchantModel");
const { uploadOnCloudinary } = require("../../utils/cloudinary");
const Shop = require("../models/shopModel");
const emptyTempFolder = require("../../utils/emptyTempFolder");
const { otpMsg, forgetPasswordLinkMsg } = require("../../utils/html");


exports.login = async (req, res) => {
    try {
        const { id, password } = req.body
        if (!id || !password) return res.status(400).json({ error: "Id or password are required" });
        const userData = await Merchant.findOne({ loginId: id }).select("+password");
        if (!userData) return res.status(400).json({ error: "Invalid credentials" });
        const isMatchPassword = await bcrypt.compare(password, userData.password);
        if (!isMatchPassword) return res.status(400).json({ error: "Invalid credentials" });
        if (!userData.isVerify) return res.status(400).json({ error: "Account under verification by admin." });
        if (!userData.isActive) return res.status(400).json({ error: "You Account is Blocked by admin." });
        userData.password = "******"
        const decryptData = await userData.decryptBankInfo()
        userData.bankInformation = decryptData.bankInformation
        userData.govId = decryptData.document.govId
        userData.businessLicense = decryptData.document.businessLicense
        userData.taxDocument = decryptData.document.taxDocument
        const token = generateToken({ id: userData._id })
        res.cookie("token", token, {
            maxAge: 2 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        })
        console.log(userData)
        return res.status(200).json({
            message: "Login Successfully", data: userData, token
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Internal server error"
        })
    }
}

exports.logout = async (req, res) => {
    try {
        res.cookie("token", "", { maxAge: 0 });
        return res.status(200).send({
            message: "log out successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: "Internel server error",
        });
    }
};

exports.sentOtpForReg = async (req, res) => {
    try {
        const { name, email, phoneNo } = req.body
        if (!name || !email || !phoneNo) return res.status(400).json({ error: "Name, Email and Phone No. are required." });
        const existMerchant = await Merchant.findOne({ email })
        if (existMerchant) {
            if (!existMerchant.isVerify) return res.status(400).json({ error: "Account under verification.", data: existMerchant });
            return res.status(400).json({ error: "Account Already created" })
        }
        const otp = await (Math.floor(100000 + Math.random() * 900000)).toString();
        const otpSend = await sendEmail(email, "OTP for reg. email verification", otpMsg(otp))
        if (!otpSend) return res.status(500).json({ error: "Email not sent" });
        const encryptOtp = await hashPassword(otp.toString())
        const genCookieData = encrypt(generateToken({ name, email, phoneNo, pass: encryptOtp, passV: false }))
        res.cookie("signToken", genCookieData, {
            maxAge: 20 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        })
        return res.status(200).json({ message: "OTP send." })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: "Internel server error",
        });
    }
}

exports.checkOtp = async (req, res) => {
    try {
        const { otp } = req.body
        const encryptData = await req.cookies.signToken
        if (!encryptData) return res.status(400).json({ error: "otp not set" });
        const cookieToken = decrypt(encryptData)
        const decodedData = await jwt.verify(cookieToken, process.env.JWT_SECRET);
        if (decodedData.pass === 0) return res.status(400).json({ error: "OTP already verify." })
        const isMatchOtp = await bcrypt.compare(otp, decodedData.pass);
        if (!isMatchOtp) {
            return res.status(400).json({ error: "Wrong OTP" }); // Ensure the function exits here
        }
        const genCookieData = encrypt(generateToken({ ...decodedData, pass: 0, passV: true }))
        res.cookie("signToken", genCookieData, {
            maxAge: 30 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        })
        return res.status(200).json({ message: "OTP verify successfully." })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: "Internel server error",
        });
    }
}

exports.sentRequestForm = async (req, res) => {
    try {
        const {

            // Shop Data
            businessName, businessCategory, businessAddressStreet, businessAddressCity, businessAddressPostalCode, businessAddressCountry,
            businessRegistrationNumber, businessPhoneNo, businessEmail, socialMediaLink, establishedDate, businessDescription,

            // Merchant Data
            merchantAddressStreet, merchantAddressCity, merchantAddressPostalCode, merchantAddressCountry, branchCode, accountType, accountHolder, bankName, branchName, accountNumber

        } = req.body;

        // Validate required text fields
        if (
            !businessName ||
            !businessCategory ||
            !businessAddressStreet ||
            !businessAddressCity ||
            !businessAddressPostalCode ||
            !businessAddressCountry ||
            !businessRegistrationNumber ||
            !businessPhoneNo ||
            !businessEmail ||
            !establishedDate ||
            !businessDescription ||
            !merchantAddressStreet ||
            !merchantAddressCity ||
            !merchantAddressPostalCode ||
            !merchantAddressCountry ||
            !branchCode ||
            !accountType ||
            !accountHolder ||
            !bankName ||
            !branchName ||
            !accountNumber
        ) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Validate files
        const files = req.files;
        if (!files || !files.govId || !files.businessLicense || !files.taxDocument || !files.profile) {
            return res.status(400).json({ error: 'All files (Gov ID, Business License, Tax Document, Profile Image) are required.' });
        }

        const encryptData = req.cookies.signToken
        if (!encryptData) return res.status(400).json({ error: "session expired" });
        const cookieToken = decrypt(encryptData)
        const decodedData = await jwt.verify(cookieToken, process.env.JWT_SECRET);
        if (!decodedData.name || !decodedData.email || !decodedData.phoneNo || !decodedData.passV) return res.status(400).json({ error: "session expired" });
        if (!decodedData.passV) return res.status(400).json({ error: "OTP not verify" });

        if(await Shop.findOne({businessRegistrationNumber})){
            return res.status(400).json({error: "Enter unique business registration number."})
        }

        const merchantData = {
            name: decodedData.name,
            email: decodedData.email,
            phoneNo: decodedData.phoneNo,
            address: {
                street: merchantAddressStreet,
                city: merchantAddressCity,
                postalCode: merchantAddressPostalCode,
                country: merchantAddressCountry
            },
            bankInformation: {
                branchCode,
                accountType,
                accountHolder,
                bankName,
                branchName,
                accountNumber
            },
            govId: { url: null, public_id: null },
            businessLicense: { url: null, public_id: null },
            taxDocument: { url: null, public_id: null },
            profile: { url: null, public_id: null }
        }

        // Check file sizes
        for (const fileKey of ['govId', 'businessLicense', 'taxDocument', "profile"]) {
            if (files[fileKey][0].size < 5 * 1024 || files[fileKey][0].size > 10 * 1024 * 1024) {
                return res.status(400).json({ error: `${fileKey} must be between 5KB and 10MB.` });
            }
        }

        for (const fileKey of ['govId', 'businessLicense', 'taxDocument', "profile"]) {
            const uploadFile = await uploadOnCloudinary(files[fileKey][0].path)
            if (!uploadFile) return res.status(500).json({ error: "File not uploaded." })
            merchantData[fileKey].url = uploadFile.url
            merchantData[fileKey].public_id = uploadFile.public_id
        }

        
        // Save data to database
        const newMerchant = await Merchant.create(merchantData);
        
        const shopData = {
            merchantId: newMerchant._id,
            name: businessName,
            businessCategory,
            businessRegistrationNumber,
            socialMediaLink,
            description: businessDescription,
            address: {
                street: businessAddressStreet,
                city: businessAddressCity,
                postalCode: businessAddressPostalCode,
                country: businessAddressCountry
            },
            contact: {
                phoneNo: businessPhoneNo,
                email: businessEmail
            },
            establishedDate
        }
        console.log(merchantData)
        
        console.log("shop", shopData)
        const newShop = await Shop.create(shopData)
        
        res.cookie("signToken", '', {
            maxAge: 0,
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        })

        return res.status(201).json({ message: 'Business created successfully.', merchant: newMerchant, shop: newShop });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while creating the business.' });
    } finally {
        await emptyTempFolder();
    }
}


exports.forgetPassword = async (req, res) => {
    const { emailOrLoginId } = req.body;

    if (!emailOrLoginId) {
        return res.status(400).json({ error: 'Email or Login ID is required.' });
    }

    try {
        // Step 1: Find user by email or login ID
        const user = await Merchant.findOne({
            $or: [{ email: emailOrLoginId }, { loginId: emailOrLoginId }],
        });

        if (!user) {
            return res.status(404).json({ error: 'Merchant not found.' });
        }

        // Step 2: Generate a secure token
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Step 3: Hash the token and save it in the database with expiry
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.passwordResetToken = hashedToken;
        user.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1-hour expiry
        await user.save();

        // Step 4: Create a password reset link
        const resetLink = `${req.headers.origin}/reset-password/${resetToken}`;

        // Step 5: Send email
        const msg = forgetPasswordLinkMsg(user.name, resetLink)
        const sendLink = await sendEmail(user.email, "Reset Password", msg)

        if (sendLink) {
            return res.status(200).json({ message: 'Password reset email sent successfully.' });
        } else {
            return res.status(500).json({ error: 'Failed to send email. Try again later.' });
        }
    } catch (error) {
        console.error('Forget Password Error:', error);
        return res.status(500).json({ error: 'An error occurred. Please try again later.' });
    }
};

exports.changeForgetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    console.log(token, newPassword)

    if (!token || !newPassword) {
        return res.status(400).json({ error: 'Token and new password are required.' });
    }

    try {
        // Step 1: Hash the token from the request to match the stored hash
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // Step 2: Find the user by the token and ensure it hasn't expired
        const user = await Merchant.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }, // Ensure token is not expired
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired token.' });
        }

        // Step 3: Hash the new password
        const hashedPassword = await hashPassword(newPassword);

        // Step 4: Update the user's password and clear the reset token fields
        user.password = hashedPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save();

        return res.status(200).json({ message: 'Password changed successfully.' });
    } catch (error) {
        console.error('Change Password Error:', error);
        return res.status(500).json({ error: 'An error occurred. Please try again later.' });
    }
};
