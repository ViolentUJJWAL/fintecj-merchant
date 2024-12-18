const express = require("express");
const jwtToken = require("../../middlewares/jwtToken");
const { getMerchantOrders, updateOrderStatus, getLatestOrder } = require("../controllers/orderController");
const router = express.Router();


// Route to add a new notice
router.get("/",jwtToken, getMerchantOrders);
router.get("/latest",jwtToken, getLatestOrder);
router.put("/:id",jwtToken, updateOrderStatus);


module.exports = router;