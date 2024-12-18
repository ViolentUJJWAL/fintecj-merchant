import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import ProductService from '../../services/productServices';
// import dashboardService from '../../services/dashboardServices';
// import { setOrder, setProducts } from '../../Redux/dataSlice/dataSlice';
// import { FaRegStarHalfStroke, FaStar, FaRegStar } from "react-icons/fa6";
// import { useNavigate } from 'react-router-dom';
// import CategoryDistribution from '../../components/Graphs/Products/CategoryDistribution';
// import StockDistribution from '../../components/Graphs/Products/StockDistribution';
// import dashboardServices from '../../services/dashboardServices';
// import TopSellingProducts from './TopSellingProducts';
// import CustomerGrowth from '../../components/Graphs/Customers/CustomerGrowth';
// import TopCustomers from '../../components/Graphs/Customers/TopCustomers';
// import CustomerGrowthGraph from '../../components/Graphs/Customers/CustomerGrowth';
// import TotalOrders from '../../components/Graphs/Orders/TotalOrders';
// import CompletedOrdersGraph from '../../components/Graphs/Orders/CompletedOrders';
// import CanceledOrdersChart from '../../components/Graphs/Orders/CanceledOrders';
// import StatusDistributionChart from '../../components/Graphs/Orders/StatusDistribution';
// import orderServices from '../../services/orderServices';
import OrderDashboard from './Graphs/OredrOverview';
import CustomerDashboard from './Graphs/CustomerDashboard ';
import ProductDashboard from './Graphs/ProductDashboard ';
import ShopDashboard from './Graphs/ShopDashboard';

function Home() {

  // const dispatch = useDispatch();
  // const navigate = useNavigate()
  // const [products, setStateProducts] = useState(useSelector((state) => state.allData.products));
  // const [categoryData, setCategoryData] = useState([]);
  // const [stockData, setStockData] = useState([]);
  // const [topProducts, setTopProducts] = useState([]);
  // console.log("products", products)
  // const [latestOrders, setLatestOrders] = useState(useSelector((state) => state.allData.orders));
  
  // const [showAllProducts, setShowAllProducts] = useState(false);
  // const [showAllOrders, setShowAllOrders] = useState(false);


  // useEffect(() => {
  //   if (!products) {
  //     fetchAllProduct()
  //   }
  //   if (!latestOrders) {
  //     fetchAllOrder()
  //   }
  // }, [])

  // useEffect(() => {
  //   fetchStatisticsData()
  // }, [])

  // const fetchStatisticsData = async () => {
  //   try {
  //     console.log("fetch.......")
  //     const resData = await dashboardService.getStatistics()
  //     console.log("res", resData)
  //     setCategoryData(resData.products.categoryDistribution);
  //     setStockData(resData?.products?.stockDistribution);
  //     setTopProducts(resData?.products?.topSellingProducts)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  // console.log("categoryData", categoryData)
  // console.log("stockData", stockData);
  // console.log("topProducts", topProducts);


  // const fetchAllProduct = async () => {
  //   try {
  //     console.log("fetch.......")
  //     const resData = await ProductService.getAllProducts()
  //     setStateProducts(resData.products)
  //     dispatch(setProducts({ products: resData.products }))
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
  // const fetchAllOrder = async () => {
  //   try {
  //     console.log("fetch.......")
  //     const resData = await orderServices.latestOrders()
  //     console.log(resData)
  //     setLatestOrders(resData.data)
  //     dispatch(setOrder({ orders: resData.data }))
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }


  // const toggleViewProducts = () => setShowAllProducts(!showAllProducts);

  // const toggleViewOrders = () => setShowAllOrders(!showAllOrders);

  // // Show products - if showAll is true, show all products, otherwise show only the first 5
  // const displayedProducts = (products?.length > 0) ? showAllProducts ? products : products.slice(0, 4) : [];

  // const displayedOrders = (latestOrders?.length > 0) ? showAllOrders ? latestOrders : latestOrders.slice(0, 4) : [];

  // const truncateProductName = (name) => {
  //   return name.length > 6 ? name.slice(0, 6) + '...' : name;
  // };

  // const renderStarRating = (rating) => {
  //   const fullStars = Math.floor(rating);
  //   const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  //   const emptyStars = 5 - fullStars - halfStar;

  //   return (
  //     <div className="flex items-center">
  //       {[...Array(fullStars)].map((_, i) => (
  //         <span key={`full-${i}`} className="text-yellow-500"><FaStar /></span>
  //       ))}
  //       {halfStar > 0 && <span className="text-yellow-500">
  //         <FaRegStarHalfStroke />
  //       </span>}
  //       {[...Array(emptyStars)].map((_, i) => (
  //         <span key={`empty-${i}`} className="text-gray-700"><FaRegStar /></span>
  //       ))}
  //       <span className="ml-1 text-sm text-gray-600">({rating.toFixed(1)})</span>
  //     </div>
  //   );
  // };

  return (
    <div className="">
      <div className="container mx-auto">

{/*         
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-[#002E6E]">Total Products :</h3>
                <span className="text-lg font-semibold text-[#002E6E]">{products?.length}</span>
              </div>
            </div>

          
            <div className="space-y-3 max-h-[250px] overflow-y-auto" style={{ maxHeight: '250px' }}>             {(displayedProducts.length === 0) &&
              <div className='text-center font-bold text-lg '>
                <span style={{ cursor: "click" }} onClick={() => navigate("/inventory")}>No product (add product)</span>
              </div>}
              {displayedProducts.map((product, index) => (
                <div key={index} style={{ cursor: "pointer" }} onClick={() => navigate(`/inventory/${product._id}`)} className={` flex items-center justify-between p-3 rounded-lg cursor-pointer 
              transition - all duration-300  ${(product.stock > 5) ? "bg-[#00baf250]" : (product.stock > 1) ? "bg-yellow-100" : "bg-red-50"} p-2 rounded-lg`}>

                  <div>
                    <p className="font-semibold text-gray-800">{truncateProductName(product.name)}</p>
                  </div>

                  <div className="flex items-center space-x-4">{product.stock}</div>
                  <div className={`text-sm font-semibold ${(product.status === "active") ? "text-green-500" : "text-red-500"}`}>{(product.status === "active") ? "Active" : "Inactive"}</div>
                  <div className="font-bold text-base">{renderStarRating(product.avgRating)}</div>
                </div>
              ))}
            </div>


           
            {(displayedProducts.length > 0) &&
              <div className='flex justify-end px-4'>
                <button
                  onClick={toggleViewProducts}
                  className="mt-4 text-blue-500 font-semibold hover:text-blue-700 transition duration-300">
                  {showAllProducts ? 'View Less' : 'View More'}
                </button>
              </div>
            }
          </div>

         
          <div className="bg-white shadow-lg border border-spacing-1 rounded-lg flex flex-col p-4 w-full">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold text-[#002E6E]">Latest Orders :</h3>
              <span className="text-lg font-semibold text-[#002E6E]">{latestOrders?.length}</span>
            </div>

            
            <div className="space-y-4 mb-4 overflow-y-auto" style={{ maxHeight: '220px' }}>
              {(displayedOrders.length === 0) &&
                <div className='text-center font-bold text-lg '>
                  No Order
                </div>}
              {displayedOrders.map(order => (
                <div key={order.id} className="grid grid-cols-4 gap-2 p-2 bg-[#00baf250] rounded-lg">
                  <div className="text-sm font-semibold">{order.productName}</div>
                  <div className="text-xs text-gray-500">{order.date}</div>
                  <div className="text-base font-bold">${order.amount.toFixed(2)}</div>
                  <div className={`text-base font-semibold ${order.status === 'Shipped' ? 'text-green-500' : order.status === 'Processing' ? 'text-yellow-500' : 'text-red-500'}`}>{order.status}</div>
                </div>
              ))}
            </div>

            {
              (displayedOrders.length > 0) &&

              <button
                onClick={toggleViewOs}
                className="text-blue-500 font-semibold hover:text-blue-700 transition duration-300 ">
                {showAllOrders ? 'View Less' : 'View More'}
              </button>
            }
          </div >

        </div >


        <div className="bg-white p-6 mt-5 rounded-xl shadow-md">
          <h3 className="text-center text-xl font-bold text-gray-800 mb-4">
            Products
          </h3>

          <div className="flex gap-6 justify-between items-start">
            <div>
              <div className="bg-white rounded-xl p-6 max-w-[100%]">
                <CategoryDistribution data={categoryData} />
              </div>

              <div className="bg-white rounded-xl p-6 max-w-[100%]">
                <StockDistribution data={stockData} />
              </div>
            </div>
            <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 flex-1 max-w-[70%]">
              <TopSellingProducts products={topProducts} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 mt-5 rounded-xl shadow-md">
          <h3 className="text-center text-xl font-bold text-gray-800 mb-4">Customers</h3>

          <div className="flex flex-col lg:flex-row gap-6 justify-between items-start">

            
            <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 flex-1 w-full lg:w-[48%]">
              <CustomerGrowth />
            </div>
          </div>
        </div>
        <div className='bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 my-4'>
          <h2 className='text-center font-thin text-3xl mb-3'>Orders </h2>
          <div className="flex justify-between gap-4">
            <div className="w-full sm:w-1/2 lg:w-1/2 xl:w-1/2">
              <TotalOrders />
            </div>
            <div className=" w-full sm:w-1/2 lg:w-1/2 xl:w-1/2">
              <CompletedOrdersGraph />
            </div>

          </div>

          <div className="flex  gap-6 mt-5">

            <div className=" w-full sm:w-1/2 lg:w-1/2 xl:w-1/2">
              <CanceledOrdersChart />
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/2">
              <StatusDistributionChart />
            </div>
          </div>

        </div> */}

        <OrderDashboard/>
        <CustomerDashboard/>
        <ProductDashboard/>
        <ShopDashboard/>

      </div>
    </div >
  );
}

export default Home; 