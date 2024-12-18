import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductService from "../../services/productServices";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../../Redux/dataSlice/dataSlice";

const ProductList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [products, setStateProducts] = useState(useSelector((state) => state.allData.products));
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    stockStatus: "",
    price: "",
    category: "",
  });
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([
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
    "Others",
  ]);


  useEffect(() => {
    if (!products) {
      fetchAllProduct();
    }
  }, [products]);

  const fetchAllProduct = async () => {
    try {
      setLoading(true);
      const data = await ProductService.getAllProducts();
      setStateProducts(data.products);
      console.log(data.products)
      dispatch(setProducts({ products: data.products }));
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleShowMore = () => setShowAll(!showAll);

  const toggleStatus = async (productId, currentStatus) => {
    setLoading(true);
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      await ProductService.updateProduct(productId, { status: newStatus });
      const updatedProducts = products.map((product) =>
        product._id === productId ? { ...product, status: newStatus } : product
      );
      setStateProducts(updatedProducts);
      dispatch(setProducts({ products: updatedProducts }));
    } catch (error) {
      console.error("Failed to toggle product status:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products?.filter((product) => {
    const isNameMatch = product.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const isStockMatch =
      filters.stockStatus === "" ||
      (filters.stockStatus === "In Stock" && product.stock > 0) ||
      (filters.stockStatus === "Low Stock" &&
        product.stock <= 10 &&
        product.stock > 0) ||
      (filters.stockStatus === "Out of Stock" && product.stock === 0);
    const isPriceMatch =
      filters.price === "" || product.price <= parseFloat(filters.price);
    const isCategoryMatch =
      filters.category === "" || product.category === filters.category;

    return isNameMatch && isStockMatch && isPriceMatch && isCategoryMatch;
  });

  const displayedProducts = showAll
    ? filteredProducts
    : filteredProducts?.slice(0, 5);

  return (
    <div className="p-6">
      {/* Search and Filter Section */}
      <div className="mb-4 flex flex-col lg:flex-row gap-4 items-center">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search products"
          className="p-3 border-2 rounded-md shadow-sm w-full lg:w-1/3"
        />
        <div className="flex gap-4 w-full lg:w-2/3">
          <select
            name="stockStatus"
            value={filters.stockStatus}
            onChange={handleFilterChange}
            className="p-3 border-2 rounded-md shadow-sm w-full"
          >
            <option value="">Stock Status</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
          <input
            type="number"
            name="price"
            value={filters.price}
            onChange={handleFilterChange}
            placeholder="Max Price"
            className="p-3 border-2 rounded-md shadow-sm w-full"
          />
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="p-3 border-2 rounded-md shadow-sm w-full"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Table */}
      <table className="w-full table-auto border-collapse bg-white rounded-lg shadow-md">
        <thead>
          <tr className="bg-gradient-to-r from-[#00BAF6] to-[#002E6E] text-white">
            <th className="border px-6 py-3">Name</th>
            <th className="border px-6 py-3">Description</th>
            <th className="border px-6 py-3">Price</th>
            <th className="border px-6 py-3">Stock Quantity</th>
            <th className="border px-6 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {displayedProducts?.map((product) => (
            <tr
              onClick={() => navigate(`/inventory/${product._id}`)}
              key={product.id}
              className="border-t hover:bg-gray-100 transition duration-300 cursor-pointer hover:bg-gray-300"
            >
              <td className="px-6 py-4">{product.name}</td>
              <td className="px-6 py-4 text-sm">
                {product.description.length > 100 ? (
                  <span>{product.description.slice(0, 100)}...</span>
                ) : (
                  product.description
                )}
              </td>
              <td className="px-6 py-4">{product.price}</td>
              <td className="px-6 py-4 text-center">{product.stock}</td>
              <td className="px-6 py-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleStatus(product._id, product.status);
                  }}
                  className={`${
        loading ? "text-gray-400 cursor-not-allowed" : ""
      } ${
        product.status === "active"
          ? "text-green-500"
          : "text-red-500"
      } hover:text-gray-700`}
                  disabled={loading}
                >
                  {product.status === "active" ? "Active" : "Inactive"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Show More Button */}
      {filteredProducts?.length > 5 && (
        <button
          onClick={handleShowMore}
          className="mt-4 text-blue-500 hover:text-blue-700"
          disabled={loading}
        >
          {showAll ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
};

export default ProductList;
