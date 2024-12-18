const Shop = require('../models/shopModel'); // Adjust the path based on your project structure


exports.getShopById = async (req, res) => {
  try {
    console.log('req.params', req.params)
    const { id } = req.params;
    const shop = await Shop.findById(id).populate('products');

    if (!shop) {
      return res.status(404).json({ error: 'Shop not found.' });
    }

    return res.status(200).json({ message: "get Shop", shop });
  } catch (error) {
    console.error('Error fetching shop by ID:', error);
    return res.status(500).json({ error: 'Internal Server Error.' });
  }
};

exports.updateShop = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if the shop exists
    const shop = await Shop.findById(id);
    if (!shop) {
      return res.status(404).json({ error: 'Shop not found.' });
    }

    // Update fields
    const updatedShop = await Shop.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true } // Run validators on update
    );

    return res.status(200).json({ message: 'Shop updated successfully.', shop: updatedShop });
  } catch (error) {
    console.error('Error updating shop:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ error: 'Validation Error', details: errors });
    }

    return res.status(500).json({ error: 'Internal Server Error.' });
  }
};

exports.getMyShop = async (req, res) => {
  try {

    const shop = await Shop.findOne({merchantId: req.user._id});

    if (!shop) {
      return res.status(404).json({ error: 'Shop not found.' });
    }

    return res.status(200).json({ message: "get My Shop", shop });
  } catch (error) {
    console.error('Error fetching shop by ID:', error);
    return res.status(500).json({ error: 'Internal Server Error.' });
  }
};
