import React from 'react';
import { Package, TrendingUp, ShoppingCart, DollarSign } from 'lucide-react';

const OrderDashboardSkeleton = () => {
  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto">
        {/* Page Title Skeleton */}
        <div className='sticky top-[-10px] z-20 bg-gray-200 rounded-lg animate-pulse'>
          <div className="h-16 bg-gray-300 rounded-lg mb-6"></div>
        </div>

        <div className='flex'>
          {/* Overview Cards Skeleton */}
          <div className="grid w-1/2 gap-4 mb-6">
            {[
              { icon: Package, color: 'blue' },
              { icon: DollarSign, color: 'green' },
              { icon: TrendingUp, color: 'purple' },
              { icon: ShoppingCart, color: 'indigo' }
            ].map((item, index) => (
              <div key={index} className="bg-gray-100 p-4 rounded-lg flex shadow items-center space-x-4 animate-pulse">
                <item.icon className={`text-${item.color}-300 w-12 h-12`} />
                <div className="flex-grow">
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                  <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Status Distribution Skeleton */}
          <div className="w-1/2 bg-gray-100 p-4 mb-6 mx-2 rounded-lg shadow mb-4 animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/2 mx-auto mb-4"></div>
            <div className="h-72 bg-gray-300 rounded w-3/4 mx-auto"></div>
          </div>
        </div>

        {/* Charts Section Skeleton */}
        <div className="bg-gray-100 rounded-lg shadow-md p-6 animate-pulse">
          {/* Timeline Buttons Skeleton */}
          <div className="sticky top-16 z-10 bg-gray-200 p-4 rounded-lg flex justify-between items-center mb-4">
            <div className="h-8 bg-gray-300 rounded w-1/4"></div>
            <div className="space-x-2 flex">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="h-8 w-20 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>

          {/* Charts Skeleton */}
          <div className="h-72 bg-gray-300 rounded w-full mb-8"></div>
          
          <div className="flex">
            <div className="w-1/2 h-72 bg-gray-300 rounded mr-4"></div>
            <div className="w-1/2 h-72 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDashboardSkeleton;