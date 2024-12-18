const express = require("express");
const { getMerchantById, changeMerchantPassword, getprofile, updateMerchantAndShop } = require("../controllers/profileController");
const jwtToken = require("../../middlewares/jwtToken");
const router = express.Router();


// Route to add a new notice
router.get("/",jwtToken, getprofile);
router.put("/",jwtToken, updateMerchantAndShop);
router.get("/:id",jwtToken, getMerchantById);
router.put("/change-password",jwtToken, changeMerchantPassword);

module.exports = router;