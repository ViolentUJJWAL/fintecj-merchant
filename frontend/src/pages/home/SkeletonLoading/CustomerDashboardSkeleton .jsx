import React from 'react';

const CustomerDashboardSkeleton = () => {
    return (
        <div className="min-h-screen p-6">
            <div className="container mx-auto">
                {/* Page Title Skeleton */}
                <div className='sticky top-[-10px] z-10 bg-gray-200 rounded-lg animate-pulse'>
                    <div className="h-16 bg-gray-300 rounded-lg"></div>
                </div>

                {/* Customer Growth Chart Skeleton */}
                <div className="bg-gray-100 shadow-md rounded-lg p-6 mb-6 animate-pulse">
                    <div className="h-8 bg-gray-300 rounded w-1/2 mx-auto mb-4"></div>
                    <div className="h-72 bg-gray-300 rounded w-full"></div>
                </div>

                {/* Top Customers Section Skeleton */}
                <div className="bg-gray-100 shadow-md rounded-lg p-6 mb-6 animate-pulse">
                    <div className="h-10 bg-gray-300 rounded w-1/3 mb-4"></div>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    {['Name', 'Email', 'Total Spent', 'Order Count'].map((header, index) => (
                                        <th key={index} className="p-3 text-left">
                                            <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {[1, 2, 3, 4, 5].map((_, index) => (
                                    <tr key={index} className="border-b border-gray-200">
                                        {[1, 2, 3, 4].map((col, colIndex) => (
                                            <td key={colIndex} className="p-3">
                                                <div className="h-5 bg-gray-300 rounded w-full"></div>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboardSkeleton;