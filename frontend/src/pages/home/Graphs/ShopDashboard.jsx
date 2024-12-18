import React, { useState, useEffect } from 'react';
import dashboardServices from "../../../services/dashboardServices"
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const ShopDashboard = () => {

    const [shops, setshops ] = useState(null)

    useEffect(()=>{
        fetchshops()
    },[])

    const fetchshops = async()=>{
        try {
            const respons = await dashboardServices.getStatistics("shops");
            console.log(respons)
            setshops(respons.shops)
        } catch (error) {
            setshops(null)
        }
    }

    // Sample data (extended from provided data)
    // const shops = {
    //     ratingOverview: [
    //         { 
    //             _id: '674d6ec6513801b4e3d2ed96', 
    //             name: 'Reymond', 
    //             averageRating: 0, 
    //             totalRatings: 0 
    //         }
    //     ],
    //     productsPerShop: [
    //         { 
    //             _id: '674d6ec6513801b4e3d2ed96', 
    //             name: 'Reymond', 
    //             productCount: 13 
    //         }
    //     ],
    //     // Added timeline data for more comprehensive visualization
    //     timelineData: [
    //         { month: 'Jan', products: 10, ratings: 0, revenue: 1500 },
    //         { month: 'Feb', products: 12, ratings: 0, revenue: 1800 },
    //         { month: 'Mar', products: 13, ratings: 0, revenue: 2000 }
    //     ]
    // };

    // Color constants
    const BLUE_THEME = {
        primary: '#3B82F6',
        secondary: '#60A5FA',
        background: '#EFF6FF',
        text: '#1E40AF'
    };

    if(!shops) return (<></>);

    return (
        <div className={`p-6`}>
            <div className="container mx-auto">
            <div className='sticky top-[-10px] z-10 bg-blue-800 rounded-lg'>
                    <h1 className="text-3xl font-bold text-white mb-6 p-4">Shop Analytics</h1>
                </div>

                {/* Shop Overview Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                    {shops.productsPerShop.map((shop) => (
                        <div 
                            key={shop._id} 
                            className="bg-white shadow-md rounded-lg p-6 border-l-4 border-blue-500"
                        >
                            <h2 className="text-xl font-semibold text-blue-800 mb-4">{shop.name}</h2>
                            <div className="space-y-2">
                                <p className="text-blue-700">
                                    <span className="font-bold">Total Products:</span> {shop.productCount}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Charts Section */}
                <div className="">
                    {/* Products Chart */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-lg font-semibold text-center text-blue-700">Monthly Products Sales</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={shops.timelineData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip 
                                    contentStyle={{
                                        backgroundColor: '#F3F4F6',
                                        borderRadius: '0.5rem',
                                        border: 'none'
                                    }}
                                />
                                <Legend />
                                <Bar 
                                    dataKey="products" 
                                    fill={BLUE_THEME.primary}
                                    name="Products Sale"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Revenue Chart */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-lg font-semibold text-center text-blue-700">Monthly Revenue Trend</h2>
                        <ResponsiveContainer width="100%" height={300} className="p-2">
                            <LineChart data={shops.timelineData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip 
                                    contentStyle={{
                                        backgroundColor: '#F3F4F6',
                                        borderRadius: '0.5rem',
                                        border: 'none'
                                    }}
                                />
                                <Legend />
                                <Line 
                                    type="monotone" 
                                    dataKey="revenue" 
                                    stroke={BLUE_THEME.primary}
                                    strokeWidth={2}
                                    name="Monthly Revenue"
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Detailed Table */}
                <div className="bg-white rounded-lg shadow-md mt-6 p-6">
                    <h2 className="text-xl font-semibold text-blue-800 mb-4">Detailed Monthly Breakdown</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-blue-100 text-blue-800">
                                <tr>
                                    <th className="p-3">Month</th>
                                    <th className="p-3">Products Sales</th>
                                    <th className="p-3">Order</th>
                                    <th className="p-3">Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {shops.timelineData.map((item, index) => (
                                    <tr key={index} className="border-b border-blue-200 hover:bg-blue-50">
                                        <td className="p-3 text-blue-900">{item.month}</td>
                                        <td className="p-3 text-blue-800">{item.products}</td>
                                        <td className="p-3 text-blue-800">{item.orders}</td>
                                        <td className="p-3 text-blue-800">R{item.revenue.toLocaleString()}</td>
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

export default ShopDashboard;