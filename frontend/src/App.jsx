import React, { useEffect } from 'react';
import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import { fetchUser } from './Redux/authSlice/authSlice';
import Home from './pages/home/Home';
import Inventory from './pages/inventory/Inventory';
import Orders from './pages/orders/orders';
import Help from './pages/help/Help';
import Wallet from './pages/wallet/Wallet';
import Profile from './pages/Profile/Profile';
import Review from './pages/review/Review';
import Login from './components/Login/Login';
import SellerRegistration from './components/SellerRegistration/SellerRegistration';
import VerificationSuccess from './components/VerificationSuccess/VerificationSuccess';
import Logout from './components/Logout/Logout';
import ForgetPassword from './components/ForgetPassward/ForgetPassward';
import ResetPassword from './components/ForgetPassward/ResetPassword';
import My_Profile from './pages/Profile/My_Profile'
import Layout from './Layout/Layout';
import MyQR from './pages/MyQR/MyQR';
import LoadingPage from './pages/Loading/Loading';
import ErrorPage from './pages/404Error/Error';
import AddFundsPage from './pages/wallet/AddFunds';
import WithdrawPage from './pages/wallet/Withdraw';
import Transfer from './pages/wallet/Transfer';
import TransactionHistory from './pages/wallet/Transactions/TransactionHistory';
import ProductDetails from './pages/inventory/ProductDetails';
import ChangePassword from './pages/Profile/ChangePassward';
import Customer from './pages/Customers/Customer'
import CustomerOrders from './pages/Customers/CustomerOrder';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);
  console.log(user)

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return <LoadingPage />; // Show a loading message while user data is being fetched
    }

    if (!isAuthenticated) {
      navigate("/login")
    }

    return children;
  };

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/seller-registration" element={<SellerRegistration />} />
        <Route path="/verification-success" element={<VerificationSuccess />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="*" element={<ErrorPage />} />


        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Home />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="/myqr" element={<Layout><MyQR /></Layout>}></Route>

        <Route
          path="/logout"
          element={
            <ProtectedRoute>
              <Layout>
                <Logout />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <Layout>
                <Inventory />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <ProductDetails />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Layout>
                <Orders />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviews"
          element={
            <ProtectedRoute>
              <Layout>
                <Review />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer"
          element={
            <ProtectedRoute>
              <Layout>
                <Customer />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <CustomerOrders/>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/wallet"
          element={
            <ProtectedRoute>
              <Layout>
                <Wallet />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-funds"
          element={
            <ProtectedRoute>
              <Layout>
                <AddFundsPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/withdraw"
          element={
            <ProtectedRoute>
              <Layout>
                <WithdrawPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/transfer"
          element={
            <ProtectedRoute>
              <Layout>
                <Transfer />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/transaction-history"
          element={
            <ProtectedRoute>
              <Layout>
                <TransactionHistory />
              </Layout>
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/transaction-detail/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <TransactionDetail />
              </Layout>
            </ProtectedRoute>
          }
        /> */}
        {/* <Route
          path="/setting"
          element={
            <ProtectedRoute>
              <Layout>
                <Setting />
              </Layout>
            </ProtectedRoute>
          }
        /> */}
        <Route
          path="/help"
          element={
            <ProtectedRoute>
              <Layout>
                <Help />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-profile"
          element={
            <ProtectedRoute>
              <Layout>
                <My_Profile />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <Layout>
                <ChangePassword />
              </Layout>
            </ProtectedRoute>
          }
        />


      </Routes>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        rtl={false}
        pauseOnFocusLoss={false}
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
