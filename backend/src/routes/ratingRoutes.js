const express = require('express');
const jwtToken = require('../../middlewares/jwtToken');
const { getMerchantShopRatings, getProductRatings, getAllProductsWithAvgRating } = require('../controllers/ratingController');
const router = express.Router();


// Route to get a shop by ID
router.get('/shop', jwtToken, getMerchantShopRatings);
router.get('/product/:id', jwtToken, getProductRatings);

module.exports = router;