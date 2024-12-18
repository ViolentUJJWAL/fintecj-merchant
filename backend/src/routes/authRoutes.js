const express = require("express");
const { login, logout, sentOtpForReg, checkOtp, sentRequestForm, forgetPassword, changeForgetPassword, checkForgetPasswordToken } = require("../controllers/authController");
const router = express.Router();
const upload = require('../../middlewares/multer');


// Route to add a new notice
router.post("/login", login);
router.get("/logout", logout);
router.post("/register-merchant/sent-otp", sentOtpForReg);
router.post("/register-merchant/check-otp", checkOtp);
router.post("/register-merchant/request-form", upload.fields([
    { name: 'govId', maxCount: 1 },
    { name: 'businessLicense', maxCount: 1 },
    { name: 'taxDocument', maxCount: 1 },
    { name: 'profile', maxCount: 1 }
]), sentRequestForm);
router.post("/forget-password", forgetPassword)
router.post("/reset-forget-password", changeForgetPassword)

module.exports = router;