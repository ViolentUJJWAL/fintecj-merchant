const Product = require('../models/productModel');
const { uploadOnCloudinary, deleteOnCloudinary } = require('../../utils/cloudinary');
const emptyTempFolder = require('../../utils/emptyTempFolder');
const Shop = require('../models/shopModel');

exports.addProduct = async (req, res) => {
    try {
        const { name, description, mrp, price, category, stock, weight, dimensions, material, color, brand, tags, status } = req.body;

        if (!name || !description || !mrp || !price || !category) return res.status(400).json({ error: "All fields are required." });

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'At least one image is required.' });
        }
        
        const shop = await Shop.findOne({ merchantId: req.user._id })
        if (!shop) return res.status(400).json({ error: "Shop not found in database." });
        
        if (await Product.findOne({ name, shopId: shop._id })) return res.status(400).json({ error: "Same product name already exists" });
        
        const uploadedImages = await Promise.all(
            req.files.map(async (file) => {
                const result = await uploadOnCloudinary(file.path);
                return { url: result.url, public_id: result.public_id };
            })
        );

        // Calculate discount
        const discount = Math.round(((mrp - price) / mrp) * 100);

        const product = new Product({
            shopId: shop._id,
            name,
            description,
            status,
            mrp,
            price,
            discount,
            category,
            tags: tags.split(","),
            stock,
            specifications: {
                weight,
                dimensions,
                material,
                color,
                brand
            },
            images: uploadedImages,
        });

        shop.products.push(product._id);

        await shop.save();
        await product.save();

        return res.status(201).json({ message: 'Product added successfully.', product });
    } catch (error) {
        console.error('Error adding product:', error);
        return res.status(500).json({ error: 'Internal server error.', details: error.message });
    } finally {
        await emptyTempFolder();
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        console.log(updates)

        const product = await Product.findById(id).populate("shopId");
        if (!product) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        if (!(product.shopId.merchantId.equals(req.user._id))) {
            return res.status(403).json({ error: "Cannot change other merchant's product." })
        }

        if (updates.name) {
            if (await Product.findOne({ name: updates.name, shopId: product.shopId._id, _id: { $ne: product._id } })) return res.status(400).json({ error: "Same product name already exists" });
        }

        // Handle image updates
        if (req.files && req.files.length > 0) {
            // Remove old images from Cloudinary
            for (const image of product.images) {
                await deleteOnCloudinary(image.public_id);
            }

            // Upload new images
            const uploadedImages = await Promise.all(
                req.files.map(async (file) => {
                    const result = await uploadOnCloudinary(file.path);
                    return { url: result.secure_url, public_id: result.public_id };
                })
            );

            updates.images = uploadedImages;
        }
        

        // Calculate discount if MRP or price is updated
        if (updates.mrp || updates.price) {
            updates.mrp = updates.mrp || product.mrp;
            updates.price = updates.price || product.price;
            updates.discount = Math.round(((updates.mrp - updates.price) / updates.mrp) * 100);
        }

        // Handle other updates
        if (updates.tags) {
            console.log(updates.tags)
            updates.tags = updates.tags
        }

        if (updates.weight || updates.dimensions || updates.material || updates.color || updates.brand) {
            updates.specifications = {
                weight: updates.weight || product.specifications.weight,
                dimensions: updates.dimensions || product.specifications.dimensions,
                material: updates.material || product.specifications.material,
                color: updates.color || product.specifications.color,
                brand: updates.brand || product.specifications.brand
            }
        }

        Object.assign(product, updates);
        await product.save();

        return res.status(200).json({ message: 'Product updated successfully.', product });
    } catch (error) {
        console.error('Error updating product:', error);
        return res.status(500).json({ error: 'Internal server error.', details: error.message });
    } finally {
        await emptyTempFolder();
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id).populate("shopId");
        if (!product) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        if (!(product.shopId.merchantId.equals(req.user._id))) {
            return res.status(403).json({ error: "Can not change other merchant product." })
        }

        // Remove images from Cloudinary
        for (const image of product.images) {
            await deleteOnCloudinary(image.public_id);
        }

        const shop = await Shop.findOne({ merchantId: req.user._id });
        if (!shop) return res.status(400).json({ error: "Shop not found in database." });

        shop.products = shop.products.filter((e) => {
            if (!(e.equals(product._id))) {
                return e;
            }
        })

        await shop.save()
        await Product.findByIdAndDelete(product._id);

        return res.status(200).json({ message: 'Product deleted successfully.' });
    } catch (error) {
        console.error('Error deleting product:', error);
        return res.status(500).json({ error: 'Internal server error.', details: error.message });
    }
};


exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the product and populate the shop and customer fields
        const product = await Product.findById(id)
            .populate('shopId') // Populate shop details
            .populate({
                path: 'ratings.customerId', // Populate customerId within the ratings array
                select: 'name profile', // Select only the required fields
            });

        if (!product) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        return res.status(200).json({ message: 'Get product', product });
    } catch (error) {
        console.error('Error fetching product:', error);
        return res.status(500).json({ error: 'Internal server error.', details: error.message });
    }
};


exports.getAllProducts = async (req, res) => {
    try {


        const shop = await Shop.findOne({ merchantId: req.user._id }).populate("products");

        if (!shop) {
            return res.status(400).json({ error: 'Shop not found' });
        }

        const products = await Product.find({ shopId: shop._id }).sort({ createdAt: -1 })
        return res.status(200).json({ message: "Get all product", products });
    } catch (error) {
        console.error('Error fetching products:', error);
        return res.status(500).json({ error: 'Internal server error.', details: error.message });
    }
};

exports.getLatestMerchantProducts = async (req, res) => {
    try {
        const shopId = await Shop.findOne({ merchantId: req.user._id });

        if (!shopId) {
            return res.status(400).json({ error: 'Shop ID is required.' });
        }

        const latestProducts = await Product.find({ shopId })
            .sort({ createdAt: -1 })
            .limit(10);

        return res.status(200).json({ message: "get latest 10 product", data: latestProducts });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error.message });
    }
};

exports.getProductStatistics = async (req, res) => {
    try {
        // Fetch the shop ID based on the merchant ID
        const shop = await Shop.findOne({ merchantId: req.user._id });

        if (!shop) {
            return res.status(400).json({ error: 'Shop not found for this merchant.' });
        }

        const shopId = shop._id;

        // Current date and date 7 days ago
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Use countDocuments for efficiency
        const totalProducts = await Product.countDocuments({ shopId });
        const inStock = await Product.countDocuments({ shopId, stock: { $gt: 0 } });
        const outOfStock = await Product.countDocuments({ shopId, stock: 0 });
        const newlyAdded = await Product.find({ shopId, createdAt: { $gte: sevenDaysAgo } });

        // Use findOne with sorting for best and low-selling products
        const bestSelling = await Product.findOne({ shopId })
            .sort({ salesCount: -1 })
            .exec();

        const lowSelling = await Product.findOne({ shopId })
            .sort({ salesCount: 1 })
            .exec();

        return res.status(200).json({
            message: "Products Statistics",
            data: {
                totalProducts,
                inStock,
                outOfStock,
                bestSelling,
                lowSelling,
                newlyAdded,
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};

