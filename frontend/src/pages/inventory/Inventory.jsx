import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon, RefreshCwIcon } from 'lucide-react';
import { useDispatch, useSelector } from "react-redux";
import ProductService from "../../services/productServices";
import { setProducts } from "../../Redux/dataSlice/dataSlice";
import ProductList from "./ProductList";
import ProductSummary from "./ProductSummary";
import AddNewProduct from "../../components/Forms/AddNewProduct";

const Inventory = () => {
  const [activeTab, setActiveTab] = useState("Product List");
  const navigate = useNavigate(); // hook for navigation

  const dispatch = useDispatch();

  const [products, setStateProducts] = useState(useSelector((state) => state.allData.products));

  const [loading, setLoading] = useState(false);


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

  return (
    <div className="w-full bg-gray-100 p-4">
      <div className="mx-auto bg-white shadow-lg rounded-xl">
        {/* Header */}
        <div className="flex items-center bg-blue-900 text-white p-4 rounded-t-xl">
          <ArrowLeftIcon className="mr-4 cursor-pointer" onClick={()=>{navigate(-1)}} />
          <h1 className="text-xl font-bold flex-grow">My Inventory</h1>
          <RefreshCwIcon
            className={`cursor-pointer ${loading ? "animate-spin" : ""}`}
            onClick={fetchAllProduct}
          />
        </div>

        <div className="p-6 space-y-4">
          {/* Tabs */}
          <div className="flex flex-wrap gap-4 justify-center mb-4">
            <button
              className={`px-4 py-2 text-sm sm:text-base font-medium ${activeTab === "Product List"
                ? "bg-[#002E6E]"
                : "bg-[#00BAF2] hover:bg-[#005A9C]"
                } text-white rounded transition-colors duration-300`}
              onClick={() => setActiveTab("Product List")}
            >
              Product List
            </button>
            <button
              // to="/add-new-product"
              className={`px-4 py-2 text-sm sm:text-base font-medium ${activeTab === "Add New Products"
                ? "bg-[#002E6E]"
                : "bg-[#00BAF2] hover:bg-[#005A9C]"
                } text-white rounded transition-colors duration-300`}
              onClick={() => setActiveTab("Add New Products")}
            >
              Add New Products
            </button>
            <button
              // to="/product-summary"
              className={`px-4 py-2 text-sm sm:text-base font-medium ${activeTab === "Product Summary"
                ? "bg-[#002E6E]"
                : "bg-[#00BAF2] hover:bg-[#005A9C]"
                } text-white rounded transition-colors duration-300`}
              onClick={() => setActiveTab("Product Summary")}
            >
              Product Summary
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "Product List" && <ProductList />}
          {activeTab === "Product Summary" && <ProductSummary />}
          {activeTab === "Add New Products" && <AddNewProduct />}
        </div>
      </div>
    </div>
  );
};

export default Inventory;
