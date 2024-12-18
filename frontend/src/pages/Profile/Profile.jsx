import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoadingPage from '../Loading/Loading';
import {
  FaUserCircle,
  FaShoppingCart,
  FaProductHunt,
  FaCommentAlt,
  FaWallet,
  FaQuestionCircle,
  FaInfoCircle,
  FaLock
} from 'react-icons/fa';

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingLayout, setLoadingLayout] = useState("fullscreen");

  const handleNavigation = (path) => {
    navigate(path);
  };

  useEffect(() => {
    const checkScreenSize = () => {
      const isSidebarLayout = window.innerWidth > 1024;
      setLoadingLayout(isSidebarLayout ? "sidebar" : "fullscreen");
    };

    checkScreenSize();

    window.addEventListener('resize', checkScreenSize);

    if (!isAuthenticated) {
      // navigate('/login');
    } else {
      const loadingTimeout = setTimeout(() => {
        setIsLoading(false);
        console.log('user', user);
      }, 1500);

      return () => {
        clearTimeout(loadingTimeout);
        window.removeEventListener('resize', checkScreenSize);
      };
    }
  }, [isAuthenticated, navigate]);

  if (isLoading || !user) {
    return <LoadingPage layout={loadingLayout} />;
  }

  return (
    <div className="container mx-auto my-10 px-4">
      <button
        className="flex items-center mb-4 text-blue-500 hover:text-blue-700"
        onClick={() => navigate(-1)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back
      </button>

      <div className="bg-white rounded-lg shadow-lg">
        <div
          className="flex flex-col lg:flex-row items-center justify-between p-4 hover:bg-gray-100 rounded-md cursor-pointer border-b"
          onClick={() => handleNavigation('/my-profile')}
        >
          <div className="flex items-center mb-4 lg:mb-0">
            <FaUserCircle className="text-5xl text-blue-500 mr-4" />
            <div>
              <h1 className="text-2xl font-bold">{user.name || 'User Name'}</h1>
              <p className="text-gray-600 text-sm">{user.email}</p>
            </div>
          </div>
          <span className="text-gray-400 text-xl font-bold ml-auto mr-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </div>

        <div className="p-6 space-y-4">
          <div
            className="flex items-center justify-between px-4 py-3 hover:bg-gray-100 rounded-md cursor-pointer"
            onClick={() => navigate('/change-password')}
          >
            <div className="flex items-center">
              <FaLock className="text-2xl text-blue-500 mr-4" />
              <span>Change Passward </span>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div
            className="flex items-center justify-between px-4 py-3 hover:bg-gray-100 rounded-md cursor-pointer"
            onClick={() => handleNavigation('/orders')}
          >
            <div className="flex items-center">
              <FaShoppingCart className="text-2xl text-orange-500 mr-4" />
              <span>Orders</span>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div
            className="flex items-center justify-between px-4 py-3 hover:bg-gray-100 rounded-md cursor-pointer"
            onClick={() => handleNavigation('/inventory')}
          >
            <div className="flex items-center">
              <FaProductHunt className="text-2xl text-red-500 mr-4" />
              <span>My Products</span>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div
            className="flex items-center justify-between px-4 py-3 hover:bg-gray-100 rounded-md cursor-pointer"
            onClick={() => handleNavigation('/reviews')}
          >
            <div className="flex items-center">
              <FaCommentAlt className="text-2xl text-purple-500 mr-4" />
              <span>Reviews & Feedback</span>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div
            className="flex items-center justify-between px-4 py-3 hover:bg-gray-100 rounded-md cursor-pointer"
            onClick={() => handleNavigation('/wallet')}
          >
            <div className="flex items-center">
              <FaWallet className="text-2xl text-teal-500 mr-4" />
              <span>Wallet</span>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div
            className="flex items-center justify-between px-4 py-3 hover:bg-gray-100 rounded-md cursor-pointer"
            onClick={() => handleNavigation('/help')}
          >
            <div className="flex items-center">
              <FaQuestionCircle className="text-2xl text-indigo-500 mr-4" />
              <span>Help & Support</span>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
