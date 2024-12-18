const express = require("express");
const jwtToken = require("../../middlewares/jwtToken");
const { addProduct, updateProduct, deleteProduct, getAllProducts, getProductById, getLatestMerchantProducts, getProductStatistics } = require("../controllers/productController");
const upload = require("../../middlewares/multer");
const router = express.Router();


// Route to add a new notice
router.get("/",jwtToken, getAllProducts);
router.get("/latest-product", jwtToken, getLatestMerchantProducts);
router.get("/statistics", jwtToken, getProductStatistics);
router.post("/",jwtToken, upload.array("images"), addProduct);
router.put("/:id", jwtToken, upload.array("images"), updateProduct);
router.delete("/:id", jwtToken, deleteProduct);
router.get("/:id",jwtToken, getProductById);

module.exports = router;