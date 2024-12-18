const Shop = require('../models/shopModel'); // Adjust path as necessary
const Product = require('../models/productModel'); // Adjust path as necessary


exports.getMerchantShopRatings = async (req, res) => {
  try {
    const merchantId = req.user._id;

    const shop = await Shop.findOne({ merchantId }).populate('ratings', 'name email');

    if (!shop) {
      return res.status(404).json({ message: 'No shops found for this merchant.' });
    }

    const ratings = shop.ratings;

    return res.status(200).json({
      message: 'Ratings retrieved successfully.',
      ratings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
}


exports.getProductRatings = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate('ratings', 'name email');

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    return res.status(200).json({
      message: 'Product ratings retrieved successfully.',
      ratings: product.ratings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
}

