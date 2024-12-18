const express = require('express');
const jwtToken = require('../../middlewares/jwtToken');
const { getShopById, updateShop, getMyShop } = require('../controllers/shopController');
const router = express.Router();


// Route to get a shop by ID
router.get('/:id', jwtToken, getShopById);
router.get('/', jwtToken, getMyShop);

// Route to update a shop
router.put('/:id', jwtToken, updateShop);

module.exports = router;
