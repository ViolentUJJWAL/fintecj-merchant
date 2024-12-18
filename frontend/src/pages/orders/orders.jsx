import React, { useState, useEffect } from 'react';
import { Search, Check, Clock, Package, Archive, Download, ArrowLeftIcon, RefreshCwIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import orderServices from '../../services/orderServices';
import OrderLoading from './OrderLoading';
import CustomerInfoCard from './CustomerInfoCard';
import jsPDF from "jspdf";
import html2canvas from 'html2canvas';


const Orders = () => {
  const [activeTab, setActiveTab] = useState('New');
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const tabs = [
    { name: 'New', icon: <Clock className="w-5 h-5 mr-2" /> },
    { name: 'Preparing', icon: <Package className="w-5 h-5 mr-2" /> },
    { name: 'Picked Up', icon: <Check className="w-5 h-5 mr-2" /> },
    { name: 'History', icon: <Archive className="w-5 h-5 mr-2" /> }
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      // Perform search across all orders
      const allOrders = orders.flatMap(group => group.orders);
      const results = allOrders.filter(order =>
        order.orderId.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, orders]);

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const response = await orderServices.getMerchantOrders();
      setOrders(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false)
    }
  };

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    setLoading(true)
    try {
      await orderServices.updateOrderStatus(orderId, newStatus)
      await fetchOrders()
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  };

  const getOrdersByStatus = (status) => {
    if (status === 'History') {
      return orders
        .filter(group => ['Complete', 'Reject'].includes(group.status))
        .flatMap(group => group.orders);
    }

    const statusGroup = orders.find(group => group.status === status);
    return statusGroup ? statusGroup.orders : [];
  };

  const exportToPDF = async (orderId) => {
    // Create a new jsPDF instance
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Select the main content div to export
    const element = document.querySelector(`.${orderId}`);

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
      const imgHeight = 100;

      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);

      // Save PDF
      pdf.save(`Orders_${orderId}.pdf`);
    }
  };

  const renderOrderList = (ordersToRender) => {
    console.log(ordersToRender)
    return ordersToRender.map(order => (
      <div key={order.orderId} className={`border rounded-lg p-4 shadow-sm bg-white/50 text-black ${order.orderId}`}>
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold font-medium">{order.createdAt}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-semibold ">Order ID:</span>
              <span className="font-semibold font-medium">{order.orderId}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-semibold ">Status:</span>
              <span className="font-semibold font-medium">{order.status}</span>
            </div>
          </div>
          <div className="text-right">
          <button
              onClick={()=>exportToPDF(order.orderId)}
              className="flex text-blue-900 items-center border-2 border-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-900 hover:text-white transition"
            >
              <Download className="w-5 h-5 mr-2" />
              Export to PDF
            </button>
          </div>
        </div>

        <CustomerInfoCard customer={order.customer} />

        <div className="mt-4">
          <p className=" font-semibold mb-2">Items:</p>
          <ul className=" space-y-1">
            {order.products.map((item, index) => (
              <li key={index} className="flex justify-between">
                <span>
                  {item.product.name} x {item.quantity}
                </span>
                <span>
                <span className='font-semibold text-green-500'>R</span>{(item.product.price * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
            <hr className='border border-black' />
            <li className="flex justify-between font-bold">
                <span>
                  Total
                </span>
                <span>
                <span className='text-green-500'>R</span>{order.totalAmount.toFixed(2)}
                </span>
              </li>
          </ul>
        </div>
        {/* Only show status buttons if not in History tab */}
        {renderStatusButtons(order)}
      </div>
    ));
  };

  const renderStatusButtons = (order) => {
    const currentStatus = orders.find(group =>
      group.orders.some(o => o.orderId === order.orderId)
    )?.status;

    switch (currentStatus) {
      case 'New':
        return (
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => handleOrderStatusUpdate(order._id, 'Preparing')}
              className="w-1/2 px-6 py-2 rounded-lg text-white bg-green-500 hover:bg-green-600 focus:ring-2 focus:ring-green-300 focus:outline-none shadow-md transition duration-300"
            >
              Accept
            </button>
            <button
              onClick={() => handleOrderStatusUpdate(order._id, 'Reject')}
              className="w-1/2 px-6 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600 focus:ring-2 focus:ring-red-300 focus:outline-none shadow-md transition duration-300"
            >
              Reject
            </button>
          </div>
        );
      case 'Preparing':
        return (
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => handleOrderStatusUpdate(order._id, 'Picked Up')}
              className="w-1/2 px-8 py-2 rounded-lg text-white bg-green-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 focus:outline-none shadow-md transition duration-300"
            >
              Mark Ready
            </button>
            <button
              onClick={() => handleOrderStatusUpdate(order._id, 'Reject')}
              className="w-1/2 px-6 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600 focus:ring-2 focus:ring-red-300 focus:outline-none shadow-md transition duration-300"
            >
              Reject
            </button>
          </div>
        );
      case 'Picked Up':
        return (
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => handleOrderStatusUpdate(order._id, 'Complete')}
              className="w-1/2 px-8 py-2 rounded-lg text-white bg-green-500 hover:bg-green-600 focus:ring-2 focus:ring-green-300 focus:outline-none shadow-md transition duration-300"
            >
              Mark Completed
            </button>
            <button
              onClick={() => handleOrderStatusUpdate(order._id, 'Reject')}
              className="w-1/2 px-6 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600 focus:ring-2 focus:ring-red-300 focus:outline-none shadow-md transition duration-300"
            >
              Reject
            </button>
          </div>
        );
      default:
        return (
          <div className="mt-4">
            <button
              disabled={true}
              className={`w-full px-6 py-2 rounded-lg text-white ${(currentStatus === "Complete") ? "bg-green-500" : "bg-red-500"} focus:ring-2 focus:ring-red-300 focus:outline-none shadow-md transition duration-300`}
            >
              Order {(currentStatus === "Complete") ? "Completed" : "Rejected"}
            </button>
          </div>
        );
    }
  };

  return (
    <div className="w-full bg-gray-100 p-4">
      <div className="mx-auto bg-white shadow-lg rounded-xl">
        {/* Header */}
        <div className="flex items-center bg-blue-900 text-white p-4 rounded-t-xl">
          <ArrowLeftIcon className="mr-4 cursor-pointer" onClick={() => { navigate(-1) }} />
          <h1 className="text-xl font-bold flex-grow">My Orders</h1>
          <RefreshCwIcon
            className={`cursor-pointer ${loading ? "animate-spin" : ""}`}
            onClick={fetchOrders}
          />
        </div>

        <div className="p-6 space-y-4">
        <div className="mx-auto rounded-2xl overflow-hidden">
          <div className="text-black p-6">

            <div className="relative mb-10">
              <div className='flex'>
                <input
                  type="text"
                  placeholder="Search for order by ID"
                  className="w-full p-3 pl-12 bg-gray/20 placeholder-gray/70 text-gray rounded-xl focus:outline-none border-2 focus:ring-2 focus:ring-black"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-4 top-3.5 text-gray w-5 h-5" />
              </div>



              {/* Search Results */}
              {searchQuery && searchResults.length > 0 && (
                <div className="mt-4 space-y-4">
                  <h3 className="text-black font-semibold">Search Results:</h3>
                  {renderOrderList(searchResults)}
                </div>
              )}

              {searchQuery && searchResults.length === 0 && (
                <div className="mt-4">
                  No orders found matching your search.
                </div>
              )}
            </div>

            <div className="flex justify-between bg-blue-800">
              {tabs.map(tab => (
                <button
                  key={tab.name}
                  className={`flex-1 flex items-center justify-center p-4 transition ${activeTab === tab.name
                    ? 'text-blue-900 border-2 border-blue-800 bg-white'
                    : 'text-white hover:bg-blue-500'
                    }`}
                  onClick={() => setActiveTab(tab.name)}
                >
                  {tab.icon}
                  {tab.name}
                  <span className="ml-2 bg-gray-200 px-2 py-1 rounded-full text-sm text-black">
                    {tab.name === 'History'
                      ? (orders.find(group => group.status === "Complete")?.count || 0) +
                      (orders.find(group => group.status === "Reject")?.count || 0)
                      : (orders.find(group => group.status === tab.name)?.count || 0)
                    }
                  </span>
                </button>
              ))}
            </div>

            <div className="p-6 space-y-4">
              {(loading) ? (
                <OrderLoading />
              ) : (
                <>
                  {(
                    renderOrderList(getOrdersByStatus(activeTab))
                  )}

                  {!searchQuery && getOrdersByStatus(activeTab).length === 0 && (
                    <div className="text-center py-8 text-black">
                      No orders found in {activeTab} status
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Orders;