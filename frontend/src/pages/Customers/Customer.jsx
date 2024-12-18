import React, { useState, useEffect } from 'react';
import { Users, ShoppingCart, TrendingUp, Award, Download, ArrowLeftIcon, RefreshCwIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import customerServices from '../../services/customerService';
import jsPDF from "jspdf";
import html2canvas from 'html2canvas';

// Skeleton Components
const MetricSkeleton = () => (
  <div className="bg-gray-100 p-6 rounded-xl animate-pulse">
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-300 mb-2 w-3/4"></div>
        <div className="h-6 bg-gray-300 w-1/2"></div>
      </div>
    </div>
  </div>
);

const CustomerSkeleton = () => (
  <div className="bg-white rounded-xl p-4 flex items-center justify-between animate-pulse">
    <div className="flex items-center space-x-4">
      <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
      <div>
        <div className="h-4 bg-gray-300 mb-2 w-40"></div>
        <div className="h-3 bg-gray-300 w-32"></div>
      </div>
    </div>
    <div className="text-right">
      <div className="h-4 bg-gray-300 mb-2 w-24"></div>
      <div className="h-3 bg-gray-300 w-20"></div>
    </div>
  </div>
);

const Customer = () => {
  const [customerData, setCustomerData] = useState({
    totalCustomers: 0,
    totalOrders: 0,
    topCustomers: []
  });
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const fetchCustomerData = async () => {
    try {
      setIsLoading(true);
      const response = await customerServices.getCustomerInsights()
      console.log(response)

      setCustomerData({
        totalCustomers: response.totalInsights.totalCustomers,
        totalOrders: response.totalInsights.totalOrders,
        averageOrderValue: response.totalInsights.averageOrderValue,
        totalAmount: response.totalInsights.totalAmount,
        topCustomers: response.customerPurchaseDetails || [],
      });
    } catch (error) {
      console.error("Failed to fetch customer data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportToPDF = async () => {
    // Create a new jsPDF instance
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Select the main content div to export
    const element = document.querySelector('.customer-Insights-container');

    if (element) {
      // Use html2canvas to convert the div to a canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false
      });

      // Get canvas as image
      const imgData = canvas.toDataURL('image/png');

      // PDF page dimensions
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Calculate image dimensions to fit the page
      const imgWidth = pageWidth - 20;
      const imgHeight = pageHeight - 20;

      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);

      // Save PDF
      pdf.save(`Customer_Insights.pdf`);
    }
  };

  return (
    <div className="w-full bg-gray-100 p-4">
      <div className="mx-auto bg-white shadow-lg rounded-xl">
        {/* Header */}
        <div className="flex items-center bg-blue-900 text-white p-4 rounded-t-xl">
          <ArrowLeftIcon className="mr-4 cursor-pointer" onClick={() => { navigate(-1) }} />
          <h1 className="text-xl font-bold flex-grow">My Customers</h1>
          <RefreshCwIcon
            className={`cursor-pointer ${isLoading ? "animate-spin" : ""}`}
            onClick={fetchCustomerData}
          />
        </div>

        <div className="p-6 space-y-4">


          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Customer Insights</h1>
            <div className="flex space-x-2">
              <button
                onClick={exportToPDF}
                className="flex ml-2 px-3 py-2 rounded-lg text-white bg-blue-900 hover:bg-blue-600 focus:ring-2 focus:ring-green-300 focus:outline-none shadow-md transition duration-300"
                disabled={isLoading}
              >
                <Download className="w-5 h-5 mr-2" />
                Export to PDF
              </button>
            </div>
          </div>

          {/* Key Metrics */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[...Array(4)].map((_, index) => (
                <MetricSkeleton key={index} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-xl flex items-center space-x-4 shadow-md">
                <Users className="w-12 h-12 text-blue-600" />
                <div>
                  <p className="text-gray-500">Total Customers</p>
                  <p className="text-3xl font-bold text-blue-800">{customerData.totalCustomers}</p>
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-xl flex items-center space-x-4 shadow-md">
                <ShoppingCart className="w-12 h-12 text-green-600" />
                <div>
                  <p className="text-gray-500">Total Orders</p>
                  <p className="text-3xl font-bold text-green-800">{customerData.totalOrders}</p>
                </div>
              </div>

              <div className="bg-purple-50 p-6 rounded-xl flex items-center space-x-4 shadow-md">
                <TrendingUp className="w-12 h-12 text-purple-600" />
                <div>
                  <p className="text-gray-500">Avg. Order Value</p>
                  <p className="text-3xl font-bold text-purple-800">
                    R{customerData.averageOrderValue.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="bg-purple-50 p-6 rounded-xl flex items-center space-x-4 shadow-md">
                <TrendingUp className="w-12 h-12 text-purple-600" />
                <div>
                  <p className="text-gray-500">Total Order Amount</p>
                  <p className="text-3xl font-bold text-purple-800">
                    R{customerData.totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Top Customers Section */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <Award className="w-6 h-6 mr-2 text-yellow-600" />
                All Customers
              </h2>
            </div>

            <div className="grid gap-4">
              {isLoading ? (
                [...Array(5)].map((_, index) => (
                  <CustomerSkeleton key={index} />
                ))
              ) : (
                customerData.topCustomers.map((customer, index) => (
                  <div
                    key={customer.id}
                    onClick={() => navigate(`/customer/${customer.customerId}`)}
                    className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition cursor-pointer"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img
                          src={customer?.customerProfile?.url}
                          alt={customer?.customerName}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <span className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full px-2 py-1 text-xs">
                          #{index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{customer.customerName}</p>
                        <p className="text-sm text-gray-500">
                          Last Purchase: {customer.lastOrderDate}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        R{customer.totalAmount.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {customer.totalOrders} Total Order
                      </p>
                      <p className="text-sm text-gray-500">
                        {customer.totalProductsPurchased} Product Purchases
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Customer;