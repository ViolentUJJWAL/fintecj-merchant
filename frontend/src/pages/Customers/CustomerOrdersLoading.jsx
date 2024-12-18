import React from 'react';
import { ArrowLeftIcon } from 'lucide-react';


const CustomerOrdersSkeleton = () => {
  return (
    <div className="w-full bg-gray-100 p-4">
      <div className="mx-auto bg-white shadow-lg rounded-xl">
        {/* Header */}
        <div className="flex items-center bg-blue-900 text-white p-4 rounded-t-xl">
          <ArrowLeftIcon className="mr-4 cursor-pointer" onClick={() => { navigate(-1) }} />
          <h1 className="text-xl font-bold flex-grow">Customer</h1>
        </div>

        <div className="p-6 space-y-4">

          {/* Header Skeleton */}
          <div className="flex justify-between w-full mb-4">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Customer Details</h1>
            <div className="h-10 w-32 bg-gray-300 rounded"></div>
          </div>

          {/* Customer Profile Skeleton */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-6 w-48 bg-gray-300 rounded"></div>
              <div className="h-4 w-36 bg-gray-300 rounded"></div>
              <div className="h-4 w-44 bg-gray-300 rounded"></div>
            </div>
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-gray-50 p-6 rounded-xl flex items-center space-x-4 shadow-md">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-300 rounded"></div>
                  <div className="h-6 w-32 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Order History Skeleton */}
          <h2 className="text-xl font-bold mb-4 text-gray-800">Order History</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((order) => (
              <div key={order} className="bg-gray-50 p-4 rounded-xl shadow-sm">
                <div className="flex justify-between w-full mb-2">
                  <div className="h-4 w-32 bg-gray-300 rounded"></div>
                  <div className="h-4 w-24 bg-gray-300 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-48 bg-gray-300 rounded"></div>
                  <div className="h-4 w-36 bg-gray-300 rounded"></div>
                  <div className="space-y-1 mt-2">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="flex justify-between">
                        <div className="h-4 w-40 bg-gray-300 rounded"></div>
                        <div className="h-4 w-20 bg-gray-300 rounded"></div>
                      </div>
                    ))}
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

export default CustomerOrdersSkeleton;