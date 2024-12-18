import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductService from "../../services/productServices";
import LoadingPage from "../Loading/Loading";
import { setProducts } from "../../Redux/dataSlice/dataSlice";
import {
  FaEdit,
  FaTrashAlt,
  FaStar,
  FaStarHalfAlt,
  FaRegStar
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import Slider from "react-slick";
import { ArrowLeftIcon } from 'lucide-react';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setStateProduct] = useState(null);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [tagInput, setTagInput] = useState("");
  const [imagePreview, setImagePreview] = useState([]);

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

  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false);


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await ProductService.getProductById(id);
        console.log(data.product)
        setStateProduct(data.product);
        setEditFormData({
          name: data.product.name,
          description: data.product.description,
          mrp: data.product.mrp,
          price: data.product.price,
          discount: data.product.discount,
          category: data.product.category,
          stock: data.product.stock,
          status: data.product.status,
          tags: data.product.tags.join(),
          weight: data.product?.specifications?.weight || "",
          dimensions: data.product?.specifications?.dimensions || "",
          material: data.product?.specifications?.material || "",
          color: data.product?.specifications?.color || "",
          brand: data.product?.specifications?.brand || "",
        });
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Failed to load product details.");
      } finally {
        console.log(product)
        console.log(editFormData)
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);




  useEffect(() => {
    if (editFormData.mrp && editFormData.price) {
      const mrp = parseFloat(editFormData.mrp);
      const price = parseFloat(editFormData.price);
      const calculatedDiscount = (mrp > 0 && price > 0)
        ? Math.round(((mrp - price) / mrp) * 100)
        : 0;

      setEditFormData(prev => ({
        ...prev,
        discount: (calculatedDiscount < 0) ? 0 : calculatedDiscount
      }));
    }
  }, [editFormData.mrp, editFormData.price]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagInput = (e) => {
    const value = e.target.value;
    if (value.endsWith(" ")) {
      const trimmedTag = value.trim();
      const currentTags = editFormData.tags ? editFormData.tags.split(", ") : [];
      if (trimmedTag && !currentTags.includes(trimmedTag)) {
        setEditFormData(prev => ({
          ...prev,
          tags: currentTags.length ? `${prev.tags}, ${trimmedTag}` : trimmedTag
        }));
      }
      setTagInput("");
    } else {
      setTagInput(value);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const currentTags = editFormData.tags.split(",");
    const updatedTags = currentTags.filter(tag => tag !== tagToRemove);
    setEditFormData(prev => ({
      ...prev,
      tags: updatedTags.join()
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const fileReaders = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(prev => [...prev, { file, preview: event.target.result }]);
      };
      reader.readAsDataURL(file);
      fileReaders.push(reader);
    });
  };

  const handleRemoveImage = (indexToRemove) => {
    setImagePreview(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSaveEdit = async () => {
    try {
      console.log(editFormData)
      setLoading(true);
      const formData = new FormData();

      // Append images if any new images are selected
      imagePreview.forEach((imageData) => {
        formData.append("images", imageData.file);
      });

      // Append other form data
      Object.keys(editFormData).forEach((key) => {
        // if (key !== 'tags') {
        //   formData.append(key, editFormData[key]);
        // } 
        if (!['tags', 'specifications'].includes(key)) {
          formData.append(key, editFormData[key]);
        }
        else {
          // Special handling for tags
          const tagsArray = editFormData.tags.split(",").map(tag => tag.trim());
          tagsArray.forEach((tag, index) => {
            formData.append(`tags[${index}]`, tag);
          });
        }
      });

      const updatedProduct = await ProductService.updateProduct(id, formData);

      setStateProduct(updatedProduct.product);
      setIsEditing(false);
      setImagePreview([]);
      dispatch(setProducts({ products: null }));
    } catch (error) {
      console.error("Failed to update product:", error);
      setError("Failed to update the product.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      setLoading(true);
      await ProductService.deleteProduct(id);
      setDeleteConfirmation(false);
      dispatch(setProducts({ products: null }));
      navigate("/inventory");
    } catch (err) {
      console.error("Failed to delete product:", err);
      setError("Failed to delete the product.");
    } finally {
      setLoading(false);
    }
  };



  // Carousel settings
  const settings = {
    centerMode: false,
    infinite: false,
    slidesToShow: 5,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  if (loading) return <LoadingPage layout="sidebar" />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!product) return <div>No product found.</div>;

  return (
    <div className="w-full bg-gray-100 p-4">
      <div className="mx-auto bg-white shadow-lg rounded-xl">
        {/* Header */}
        <div className="flex items-center bg-blue-900 text-white p-4 rounded-t-xl">
          <ArrowLeftIcon className="mr-4 cursor-pointer" onClick={() => { navigate("/inventory") }} />
          <h1 className="text-xl font-bold flex-grow">{product.name}</h1>
        </div>

        <div className="p-6 space-y-4">

          {/* Edit Mode */}
          {isEditing ? (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Edit Product</h2>
              <form className="space-y-4">
                <div>
                  <label className="block mb-2">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block mb-2">Description</label>
                  <textarea
                    name="description"
                    value={editFormData.description || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    rows="4"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-2">Maximum Retail Price (MRP)</label>
                    <input
                      type="number"
                      name="mrp"
                      value={editFormData.mrp || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Selling Price</label>
                    <input
                      type="number"
                      name="price"
                      value={editFormData.price || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Discount</label>
                    <input
                      type="number"
                      name="discount"
                      readOnly
                      value={editFormData.discount || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded bg-gray-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-2">Stock</label>
                    <input
                      type="number"
                      name="stock"
                      value={editFormData.stock || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium">Category</label>
                    <select
                      name="category"
                      value={editFormData.category || ""}
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


                  <div>
                    <label className="block mb-2">Status</label>
                    <select
                      name="status"
                      value={editFormData.status || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Tags Input */}
                <div>
                  <label className="block mb-2">Tags (space-separated)</label>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={handleTagInput}
                    className="w-full p-2 border rounded"
                    placeholder="Enter tags"
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    {editFormData.tags && editFormData.tags.split(",").map((tag) => (
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
                  <label className="block mb-2">Product Images</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full p-2 border rounded"
                  />
                  <div className="mt-4 flex gap-2 flex-wrap">
                    {imagePreview.map((imageData, index) => (
                      <div key={index} className="relative">
                        <img
                          src={imageData.preview}
                          alt={`Preview ${index}`}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
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

                  {isCollapsibleOpen &&
                    [
                      { label: "Weight", name: "weight", type: "text" },
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
                          value={
                            field.name === 'weight' || field.name === 'dimensions' || field.name === 'material' || field.name === 'color' || field.name === 'brand'
                              ? editFormData?.[field.name] || ''
                              : ''
                          }
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    ))
                  }
                </div>


                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-200 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              {/* Product Details View */}
              <div className="w-full flex justify-between items-center mb-6">
                <div className="gap-4 pr-20">
                  <h3 className="text-lg mb-2 font-bold text-gray-800">{product.name}</h3>
                  <p className="text-gray-700 mb-4">{product.description}</p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-6 py-3 text-lg rounded-lg bg-[#002E6E] text-white hover:bg-[#004488]"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirmation(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    <FaTrashAlt /> Delete
                  </button>
                </div>
              </div>

              {/* Product Details Section */}

              <div className="flex gap-10">
                {/* Product Image Section */}
                <div className="flex flex-col w-1/2">
                  <div className="w-full h-96 mb-4">
                    <img
                      src={product.images[currentImageIndex]?.url || "placeholder.jpg"}
                      alt={`product-${currentImageIndex}`}
                      className="w-full h-full object-contain rounded-lg shadow-md"
                    />
                  </div>
                  <div className="w-full px-4">
                    <Slider {...settings}>
                      {product.images.map((image, index) => (
                        <div
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className="cursor-pointer px-2"
                        >
                          <img
                            src={image.url || "placeholder.jpg"}
                            alt={`thumbnail-${index}`}
                            className="h-16 w-16 object-cover rounded-md border-2 border-gray-300"
                          />
                        </div>
                      ))}
                    </Slider>
                  </div>
                </div>

                {/* Product Details Section */}
                <div className="w-1/2">
                  <div className="bg-white p-4 rounded-lg shadow-lg">
                    <div className=" gap-4">
                      <div>
                        <div className="flex">
                          <h3 className="text-lg font-semibold text-gray-700">Price: </h3>
                          <p className="font-semibold pt-1 ml-2">
                            <span className="text-gray-500">R{product.price}</span>
                            {
                              (product.discount !== 0) &&
                              <span className="text-red-500 text-sm line-through ml-2">R{product.mrp}</span>
                            }
                          </p>
                        </div>
                        {(product.discount !== 0) &&
                          (
                            <p className="font-semibold">
                              <span className="text-green-600">{product.discount}% OFF</span>
                              <span className="text-green-600 text-sm ml-2">(Save {product.mrp - product.price})</span>
                            </p>
                          )
                        }
                      </div>
                      <div className="flex">
                        <h3 className="text-lg font-semibold text-gray-700">Stock: </h3>
                        <p className={`font-semibold pt-1 ml-2 ${product.stock <= 5 ? 'text-red-600' : 'text-green-600'}`}>
                          {product.stock} units
                        </p>
                      </div>
                      <div className="flex">
                        <h3 className="text-lg font-semibold text-gray-700">Number of Units Sales: </h3>
                        <p className={`font-semibold pt-1 ml-2 text-green-600`}>
                          {product.salesCount} units
                        </p>
                      </div>
                    </div>
                    <div className="flex">
                      <h3 className="text-lg font-semibold text-gray-700">Category: </h3>
                      <p className={`font-semibold pt-1 ml-2 text-gray-500`}>
                        {product.category}
                      </p>
                    </div>
                    <div className="mt-1">
                      <h3 className="text-lg font-semibold text-gray-700">Specifications</h3>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {Object.entries(product.specifications || {}).map(([key, value]) => (
                          (value !== "") ?
                            <div key={key} className="bg-gray-100 p-2 rounded">
                              <p className="text-xs text-gray-600 capitalize">{key}</p>
                              <p className="font-medium">{value}</p>
                            </div> : ""
                        ))}
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold text-gray-700">Tags</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {product.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex text-lg my-8">
                <span className="text-2xl font-bold mr-3 text-gray-800">Average Rating:</span>
                <div className="flex pt-1 text-2xl text-yellow-500">
                  {Array.from({ length: 5 }, (_, index) => {
                    const ratingValue = index + 1;
                    if (product.avgRating >= ratingValue) {
                      return <FaStar key={index} />;
                    } else if (product.avgRating >= ratingValue - 0.5) {
                      return <FaStarHalfAlt key={index} />;
                    } else {
                      return <FaRegStar key={index} />;
                    }
                  })}
                </div>
                <p className="ml-2 pt-0.5 text-gray-600">({product.avgRating} / 5 )</p>
              </div>

              {/* Customer Reviews */}
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Customer Reviews</h2>
                <div className="bg-gray-100 hover:bg-gray-200 p-6 rounded-lg border-2">
                  {/* Display Reviews */}
                  {product.ratings.length > 0 ? (
                    product.ratings.map((rating, index) => (
                      <div key={index} className="border-2 last:border-0">
                        {/* Display Star Rating */}
                        <div className="flex items-center mb-3">
                          <div className="text-yellow-500 flex gap-1 text-xl">
                            {Array.from({ length: 5 }, (_, i) => {
                              const ratingValue = i + 1;
                              if (rating.rating >= ratingValue) {
                                return <FaStar key={i} className="transition-transform transform hover:scale-110" />;
                              } else if (rating.rating >= ratingValue - 0.5) {
                                return <FaStarHalfAlt key={i} className="transition-transform transform hover:scale-110" />;
                              } else {
                                return <FaRegStar key={i} className="transition-transform transform hover:scale-110" />;
                              }
                            })}
                          </div>
                          <span className="ml-2 text-gray-600 font-semibold">({rating.rating} / 5 stars)</span>
                        </div>

                        {/* Display Customer Info */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full border border-black bg-gray-300 flex items-center justify-center text-black font-semibold">
                            {/* Initials */}
                            {rating.customerId?.name ? rating.customerId.name[0] : "C"}
                          </div>
                          <div className="text-gray-800 font-medium">
                            <p>{rating.customerId?.name || "Anonymous"}</p>
                            <p className="text-sm text-gray-500">{new Date(rating.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>

                        {/* Display Review Text */}
                        <p className="text-gray-700 italic">{rating.review || "No review provided."}</p>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center mb-4">
                      <div className="text-yellow-500 flex gap-1 text-xl">
                        {/* Display 0 stars when there are no ratings */}
                        {Array.from({ length: 5 }, (_, i) => (
                          <FaRegStar key={i} />
                        ))}
                      </div>
                      <p className="ml-2 text-gray-800">(0 / 5 )</p>
                    </div>
                  )}
                </div>
              </div>



              {/* (Keep the existing product details view content) */}
            </>
          )}

          {/* Delete Confirmation Modal */}
          {deleteConfirmation && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <p className="text-lg mb-4">Are you sure you want to delete this product?</p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={handleDeleteProduct}
                    className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-red-600"
                    disabled={loading}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setDeleteConfirmation(false)}
                    className="bg-gray-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-600"
                    disabled={loading}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;