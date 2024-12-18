import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import customerServices from "../../services/customerService";
import { ShoppingCart, TrendingUp, Download, ArrowLeftIcon } from 'lucide-react';
import jsPDF from "jspdf";
import html2canvas from 'html2canvas';
import CustomerOrdersSkeleton from "./CustomerOrdersLoading";

const CustomerOrders = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customerDetails, setCustomerDetails] = useState(null);

  useEffect(() => {
    fetchCustomerDetails();
  }, []);

  const fetchCustomerDetails = async () => {
    try {
      const response = await customerServices.getCustomerOrderDetails(id)
      console.log(response)
      setCustomerDetails(response);
    } catch (error) {
      console.error("Failed to fetch customer details", error);
    }
  };

  const exportToPDF = async () => {
    // Create a new jsPDF instance
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Select the main content div to export
    const element = document.querySelector('.customer-details-container');

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
      pdf.save(`Customer_Orders_${customerDetails.customer.name}.pdf`);
    }
  };

  if (!customerDetails) return <CustomerOrdersSkeleton />;

  return (
    <div className="w-full bg-gray-100 p-4">
      <div className="mx-auto bg-white shadow-lg rounded-xl">
        {/* Header */}
        <div className="flex items-center bg-blue-900 text-white p-4 rounded-t-xl">
          <ArrowLeftIcon className="mr-4 cursor-pointer" onClick={() => { navigate(-1) }} />
          <h1 className="text-xl font-bold flex-grow">{customerDetails?.customer?.name || "Customer"}</h1>
        </div>

        <div className="p-6 space-y-4">

          <div className="flex justify-between w-full">
            <div>
              <h1 className="text-2xl font-bold mb-4 text-gray-800">Customer Details</h1>
            </div>
            <div>
              <button
                onClick={exportToPDF}
                className="flex ml-2 px-3 py-2 rounded-lg text-white bg-blue-900 hover:bg-blue-600 focus:ring-2 focus:ring-green-300 focus:outline-none shadow-md transition duration-300"
              >
                <Download className="w-5 h-5 mr-2" />
                Export to PDF
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-bold text-lg">
              {customerDetails.customer.name.charAt(0)}
            </div>
            <div>
              <p className="text-xl font-semibold">{customerDetails.customer.name}</p>
              <p className="text-gray-500">Phone: {customerDetails.customer.phoneNumber}</p>
              <p className="text-gray-500">Email: {customerDetails.customer.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-green-50 p-6 rounded-xl flex items-center space-x-4 shadow-md">
              <ShoppingCart className="w-12 h-12 text-green-600" />
              <div>
                <p className="text-gray-500">Total Orders</p>
                <p className="text-3xl font-bold text-green-800">{customerDetails.orderSummary.totalOrders}</p>
              </div>
            </div>

            <div className="bg-purple-50 p-6 rounded-xl flex items-center space-x-4 shadow-md">
              <TrendingUp className="w-12 h-12 text-purple-600" />
              <div>
                <p className="text-gray-500">Avg. Order Value</p>
                <p className="text-3xl font-bold text-purple-800">
                  R{customerDetails.orderSummary.averageOrderValue.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="bg-purple-50 p-6 rounded-xl flex items-center space-x-4 shadow-md">
              <TrendingUp className="w-12 h-12 text-purple-600" />
              <div>
                <p className="text-gray-500">Total Order Amount</p>
                <p className="text-3xl font-bold text-purple-800">
                  R{customerDetails.orderSummary.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-bold mb-4 text-gray-800">Order History</h2>
          <div className="space-y-4">
            {customerDetails.orderHistory.map((order) => (
              <div
                key={order._id}
                className={`${(order.status === "Complete") ? "bg-green-100" : (order.status === "Reject") ? "bg-red-100" : "bg-gray-50"} p-4 border-2 rounded-xl shadow-sm flex justify-between items-center`}
              >
                <div className="w-full">
                  <div className="flex justify-between w-full">
                    <p className="font-semibold text-gray-800">Order ID: {order.orderId}</p>
                    <p className="text-green-600 font-bold text-lg">
                      R{order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                  <p className="text-gray-500 text-sm">Status: {order.status}</p>
                  <p className="text-gray-500 text-sm">
                    Order Date: {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                  <div className="mt-4">
                    <p className=" font-semibold mb-2">Items:</p>
                    <ul className=" space-y-1">
                      {order.products.map((item, index) => (
                        <li key={index} className="flex justify-between">
                          <span>
                            {item.productName} x {item.quantity}
                          </span>
                          <span>
                            <span className='font-semibold text-green-500'>R</span>{(item.productPrice * item.quantity).toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerOrders;