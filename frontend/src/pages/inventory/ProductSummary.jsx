import React, { useEffect, useState } from "react";
import { FaBox, FaCheckCircle, FaTimesCircle, FaStar, FaChartLine } from "react-icons/fa";
import ProductService from "../../services/productServices";

const ProductSummary = () => {
  const [productSummaryData, setProductSummaryData] = useState({
    totalProducts: 0,
    inStock: 0,
    outOfStock: 0,
    lowStock: 0,
    bestSelling: null,
    lowSelling: null
  });
  const [newlyAddedProducts, setNewlyAddedProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStatistics()
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true)
      console.log("fetch......")
      const data = await ProductService.getProductStatistics()
      console.log(data.data)
      setProductSummaryData(data.data)
      const productData = await ProductService.getLatestProduct()
      console.log(productData.data)
      setNewlyAddedProducts(productData.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const renderSummaryCard = (icon, title, value, color) => (
    <div className="w-full sm:w-[18%] p-4 bg-white rounded-lg shadow-md flex items-center">
      {React.cloneElement(icon, { className: `text-${color}-500 text-3xl mr-4` })}
      <div>
        <h4 className="text-gray-700 font-semibold">{title}</h4>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="mx-auto p-6">
      <h3 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Product Summary</h3>

      {(loading) ? (<div id="loader" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        <div className="p-4 bg-white shadow rounded animate-pulse">
          <div className="h-16 bg-gray-300 rounded"></div>
          <div className="mt-2 h-4 w-1/2 bg-gray-300 rounded"></div>
        </div>
        <div className="p-4 bg-white shadow rounded animate-pulse">
          <div className="h-16 bg-gray-300 rounded"></div>
          <div className="mt-2 h-4 w-1/2 bg-gray-300 rounded"></div>
        </div>
        <div className="p-4 bg-white shadow rounded animate-pulse">
          <div className="h-16 bg-gray-300 rounded"></div>
          <div className="mt-2 h-4 w-1/2 bg-gray-300 rounded"></div>
        </div>
        <div className="p-4 bg-white shadow rounded animate-pulse">
          <div className="h-16 bg-gray-300 rounded"></div>
          <div className="mt-2 h-4 w-1/2 bg-gray-300 rounded"></div>
        </div>
        <div className="p-4 bg-white shadow rounded animate-pulse">
          <div className="h-16 bg-gray-300 rounded"></div>
          <div className="mt-2 h-4 w-1/2 bg-gray-300 rounded"></div>
        </div>
      </div>) :

        (<div className="flex flex-wrap justify-between gap-4">
          {renderSummaryCard(
            <FaBox />,
            "Total Products",
            productSummaryData.totalProducts,
            "blue"
          )}

          {renderSummaryCard(
            <FaCheckCircle />,
            "In Stock",
            productSummaryData.inStock,
            "green"
          )}

          {renderSummaryCard(
            <FaTimesCircle />,
            "Out of Stock",
            productSummaryData.outOfStock,
            "red"
          )}

          {renderSummaryCard(
            <FaStar />,
            "Best Selling",
            productSummaryData.bestSelling?.name,
            "yellow"
          )}

          {renderSummaryCard(
            <FaChartLine />,
            "Low Selling",
            productSummaryData.lowSelling?.name,
            "purple"
          )}
        </div>)}

      {/* Newly Added Products */}
      <div className="mt-8">
        <h4 className="text-xl font-semibold text-gray-800 mb-4">Newly Added Products</h4>
        {newlyAddedProducts && newlyAddedProducts.length > 0 ? (
          <div className="bg-white p-4 rounded-lg shadow-md">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Product Name</th>
                  <th className="text-left py-2">Stock</th>
                  <th className="text-left py-2">Stock Status</th>
                  <th className="text-left py-2">Sell Status</th>
                </tr>
              </thead>
              <tbody>
                {newlyAddedProducts.map((product, index) => (
                  <tr key={index} className="border-b last:border-none">
                    <td className="py-2">{product.name}</td>
                    <td className="py-2">{product.stock}</td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded-full text-sm ${product?.stock > 10 ? 'bg-green-100 text-green-800' :
                        product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                        {product.stock > 10 ? 'In Stock' :
                          product.stock > 0 ? 'Low Stock' :
                            'Out of Stock'}
                      </span>
                    </td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded-full text-sm ${product?.status === "active" ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product?.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) :
          <div className="bg-white p-4 rounded-lg shadow-md">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Product Name</th>
                  <th className="text-left py-2">Stock</th>
                  <th className="text-left py-2">Stock Status</th>
                  <th className="text-left py-2">Sell Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b last:border-none animate-pulse">
                  <td className="py-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                  </td>
                  <td className="py-2">
                    <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
                  </td>
                  <td className="py-2">
                    <div className="h-6 bg-gray-300 rounded-full w-24 mx-auto"></div>
                  </td>
                  <td className="py-2">
                    <div className="h-6 bg-gray-300 rounded-full w-24 mx-auto"></div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  );
};

export default ProductSummary;