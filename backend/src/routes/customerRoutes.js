const express = require("express");
const jwtToken = require("../../middlewares/jwtToken");
const { getCustomerInsights, getCustomerLastOrder, getCustomerOrderDetails } = require("../controllers/customerController");
const router = express.Router();


// Route to add a new notice
router.get("/",jwtToken, getCustomerInsights);
router.get("/:id",jwtToken, getCustomerLastOrder);
router.get("/details/:id", jwtToken, getCustomerOrderDetails)


module.exports = router;