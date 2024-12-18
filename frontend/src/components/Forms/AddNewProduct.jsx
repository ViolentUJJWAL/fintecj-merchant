import React, { useState, useEffect } from "react";
import ProductService from "../../services/productServices";
import { useDispatch } from 'react-redux';
import { setProducts } from '../../Redux/dataSlice/dataSlice';

const AddNewProduct = () => {
  const dispatch = useDispatch();
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    mrp: 0,
    price: 0,
    discount: 0,
    category: "",
    stock: 0,
    weight: "",
    dimensions: "",
    material: "",
    color: "",
    brand: "",
    status: "",
    images: [], // Stores image URLs for preview
    tags: [],
  });

  const categories = [
    "Electronics",
    "Clothing & Apparel",
    "Footwear",
    "Accessories (Bags, Belts, etc.)",
    "Jewelry & Watches",
    "Home Decor",
    "Furniture",
    "Kitchenware",
    "Appliances",
    "Beauty Products",
    "Haircare",
    "Skincare",
    "Health & Wellness",
    "Fitness Equipment",
    "Sports Gear",
    "Outdoor Gear",
    "Books",
    "Stationery",
    "Toys",
    "Baby Products",
    "Food & Beverages",
    "Packaged Foods",
    "Beverages",
    "Pet Supplies",
    "Automotive Parts & Accessories",
    "Art Supplies",
    "Handmade Goods",
    "Musical Instruments",
    "Gardening Tools & Supplies",
    "Others"
  ];




  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false);

  useEffect(() => {
    if (productData.mrp && productData.price) {
      const mrp = parseFloat(productData.mrp);
      const price = parseFloat(productData.price);
      const calculatedDiscount = (mrp > 0 && price > 0)
        ? Math.round(((mrp - price) / mrp) * 100)
        : 0;

      setProductData(prev => ({
        ...prev,
        discount: (calculatedDiscount < 0) ? 0 : calculatedDiscount
      }));
    }
  }, [productData.mrp, productData.price]);

  const validateForm = () => {
    const newErrors = {};

    // Check required fields
    const requiredFields = [
      'name', 'description', 'mrp', 'price', 'category', 'status', 'images'
    ];

    requiredFields.forEach(field => {
      if (!productData[field] ||
        (field === 'images' && productData[field].length === 0)) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    // Validate MRP and Price
    const mrp = parseFloat(productData.mrp);
    const price = parseFloat(productData.price);

    if (mrp <= 0) {
      newErrors['mrp'] = 'MRP must be a positive number';
    }

    if (price <= 0) {
      newErrors['price'] = 'Price must be a positive number';
    }

    if (price > mrp) {
      newErrors['price'] = 'Price cannot be higher than MRP';
    }

    // Validate stock
    const stock = parseInt(productData.stock);
    if (stock < 0) {
      newErrors['stock'] = 'Stock must be a non-negative number';
    }

    // Validate tags if added
    if (productData.tags.length > 0) {
      productData.tags.forEach((tag, index) => {
        if (tag.length < 3) {
          newErrors[`tag_${index}`] = 'Tag must be at least 3 characters long';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    // Prevent negative values for specific fields
    if ((name === "mrp" || name === "price" || name === "stock") &&
      processedValue < 0) {
      processedValue = 0;
    }

    setProductData({
      ...productData,
      [name]: processedValue
    });

    // Clear specific field error when user starts typing
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const handleTagInput = (e) => {
    const value = e.target.value;
    if (value.endsWith(" ")) {
      const trimmedTag = value.trim();
      if (trimmedTag.length >= 3 && !productData.tags.includes(trimmedTag)) {
        setProductData({ ...productData, tags: [...productData.tags, trimmedTag] });
      }
      setTagInput("");
    } else {
      setTagInput(value);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setProductData({
      ...productData,
      tags: productData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorKey = Object.keys(errors)[0];
      const errorElement = document.getElementsByName(firstErrorKey)[0];
      if (errorElement) {
        errorElement.focus();
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    console.log(productData)

    setLoading(true);
    const formData = new FormData();

    productData.images.forEach((image) => {
      formData.append("images", image.file);
    });

    Object.keys(productData).forEach((key) => {
      if (key !== "images" || key !== "tags") {
        console.log(key, productData[key])
        formData.append(key, productData[key]);
      }else if(key==="tags"){
        formData.append("tags", productData["tags"].join());
      }
    });
    
    try {
      const d = await ProductService.addProduct(formData);
      dispatch(setProducts({ products: null }));
      console.log(d)
      // Reset form after successful submission
      setProductData({
        name: "",
        description: "",
        mrp: "",
        price: "",
        discount: 0,
        category: "",
        stock: 0,
        weight: "",
        dimensions: "",
        material: "",
        color: "",
        brand: "",
        status: "",
        images: [],
        tags: [],
      });
      setTagInput("");
      setErrors({});
    } catch (error) {
      // Handle submission error 
      console.error("Product submission failed", error);
      setErrors({ submit: "Failed to add product. Please try again." });
    } finally {
      setLoading(false);
    }
  };


  const handleImageChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to an array
    const fileReaders = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProductData((prevState) => ({
          ...prevState,
          images: [...prevState.images, { file, preview: event.target.result }],
        }));
      };
      reader.readAsDataURL(file); // Generate a data URL for preview
      fileReaders.push(reader);
    });
  };

  const handleRemoveImage = (indexToRemove) => {
    setProductData((prevState) => ({
      ...prevState,
      images: prevState.images.filter((_, index) => index !== indexToRemove),
    }));
  };


  return (
    <div className="p-6 bg-gray-100 rounded-md shadow-md max-w-6xl mx-auto">

      <h3 className="text-2xl font-semibold mb-6 text-center">Add New Product</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <label className="block mb-2 font-medium">Product Name:</label>
          <input
            name="name"
            value={productData.name}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-2 font-medium">Description:</label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleInputChange}
            required
            rows="4"
            className={`w-full p-2 border rounded ${errors.description ? 'border-red-500' : ''}`}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        {/* MRP with error handling */}
        <div>
          <label className="block mb-2 font-medium">Maximum Retail Price (MRP):</label>
          <input
            type="number"
            name="mrp"
            value={productData.mrp}
            onChange={handleInputChange}
            min={0}
            required
            className={`w-full p-2 border rounded ${errors.mrp ? 'border-red-500' : ''}`}
          />
          {errors.mrp && <p className="text-red-500 text-sm mt-1">{errors.mrp}</p>}
        </div>

        {/* Selling Price with error handling */}
        <div>
          <label className="block mb-2 font-medium">Selling Price:</label>
          <input
            type="number"
            name="price"
            max={productData.mrp}
            value={productData.price}
            onChange={handleInputChange}
            min="0"
            required
            className={`w-full p-2 border rounded ${errors.price ? 'border-red-500' : ''}`}
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
        </div>

        {/* Discount */}
        <div>
          <label className="block mb-2 font-medium">Discount:</label>
          <input
            type="number"
            name="discount"
            value={productData.discount}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block mb-2 font-medium">Category:</label>
          <select
            name="category"
            value={productData.category}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="" disabled>Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Stock */}
        <div>
          <label className="block mb-2 font-medium">Stock:</label>
          <input
            type="number"
            name="stock"
            value={productData.stock}
            onChange={handleInputChange}
            required
            className={`w-full p-2 border rounded ${errors.stock ? 'border-red-500' : ''}`}
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
        </div>

        {/* Status Dropdown */}
        <div>
          <label className="block mb-2 font-medium">Status:</label>
          <select
            name="status"
            value={productData.status}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="" disabled>Select status</option>
            <option value="active" selected>Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="block mb-2 font-medium">Tags (space-separated, min 3 characters):</label>
          <input
            type="text"
            value={tagInput}
            onChange={handleTagInput}
            className="w-full p-2 border rounded"
            placeholder="Enter tags"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {productData.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded inline-flex items-center"
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 text-red-500"
                  type="button"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block mb-2 font-medium">Product Images:</label>
          <input
            type="file"
            name="images"
            accept="image/png, image/gif, image/jpeg"
            multiple={true}
            onChange={handleImageChange}
            required
            className="w-full p-2 border rounded"
          />
          <div className="mt-4 flex gap-2 flex-wrap">
            {productData?.images?.map((imageData, index) => (
              <div key={index} className="relative">
                <img
                  src={imageData.preview} // Use the data URL for preview
                  alt={`Product Preview ${index + 1}`}
                  className="w-20 h-20 object-cover rounded shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Details */}
        <div>
          <div
            className="cursor-pointer flex items-center justify-between bg-gray-200 p-3 rounded"
            onClick={() => setIsCollapsibleOpen(!isCollapsibleOpen)}
          >
            <span className="font-medium">Additional Details</span>
            <span>{isCollapsibleOpen ? "▲" : "▼"}</span>
          </div>
          {isCollapsibleOpen && (
            <div className="mt-4 space-y-4">
              {[{ label: "Weight", name: "weight", type: "text" },
              { label: "Dimensions", name: "dimensions", type: "text" },
              { label: "Material", name: "material", type: "text" },
              { label: "Color", name: "color", type: "text" },
              { label: "Brand", name: "brand", type: "text" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block mb-2 font-medium">{field.label}:</label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={productData[field.name]}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Global submission error */}

        {errors.submit && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            {errors.submit}
          </div>
        )}


        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-3 text-white rounded-xl transition-all duration-200 font-medium
                            ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200'}`}
        >
          {loading ? 'Uploading...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default AddNewProduct;
