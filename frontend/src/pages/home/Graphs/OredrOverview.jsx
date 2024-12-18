import React, { useState, useEffect } from 'react';
import dashboardServices from "../../../services/dashboardServices"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer
} from 'recharts';
import {
    Package,
    TrendingUp,
    ShoppingCart,
    DollarSign
} from 'lucide-react';
import OrderDashboardSkeleton from '../SkeletonLoading/OrderDashboardSkeleton';

const OrderDashboard = () => {

    const [order, setorder] = useState(null)

    useEffect(() => {
        fetchorder()
    }, [])

    const fetchorder = async () => {
        try {
            const respons = await dashboardServices.getStatistics("orders");
            console.log(respons)
            setorder(respons.orders)
        } catch (error) {
            setorder(null)
        }
    }

    // const order = {
    //     "monthlyTotalOrders": [
    //         { "_id": { "year": 2024, "month": 12 }, "totalOrders": 120, "totalSales": 3000 },
    //         { "_id": { "year": 2024, "month": 11 }, "totalOrders": 150, "totalSales": 3750 },
    //         { "_id": { "year": 2024, "month": 10 }, "totalOrders": 180, "totalSales": 4500 },
    //         { "_id": { "year": 2024, "month": 9 }, "totalOrders": 160, "totalSales": 4000 },
    //         { "_id": { "year": 2024, "month": 8 }, "totalOrders": 140, "totalSales": 3500 },
    //         { "_id": { "year": 2024, "month": 7 }, "totalOrders": 130, "totalSales": 3250 },
    //         { "_id": { "year": 2024, "month": 6 }, "totalOrders": 110, "totalSales": 2750 },
    //         { "_id": { "year": 2024, "month": 5 }, "totalOrders": 100, "totalSales": 2500 },
    //         { "_id": { "year": 2024, "month": 4 }, "totalOrders": 170, "totalSales": 4250 },
    //         { "_id": { "year": 2024, "month": 3 }, "totalOrders": 190, "totalSales": 4750 }
    //     ],
    //     "yearlyTotalOrders": [
    //         { "_id": 2024, "totalOrders": 1500, "totalSales": 37500 },
    //         { "_id": 2023, "totalOrders": 1400, "totalSales": 35000 }
    //     ],
    //     "last10DaysTotalOrders": [
    //         { "_id": { "year": 2024, "month": 12, "day": 1 }, "totalOrders": 10, "totalSales": 250 },
    //         { "_id": { "year": 2024, "month": 12, "day": 2 }, "totalOrders": 12, "totalSales": 300 },
    //         { "_id": { "year": 2024, "month": 12, "day": 3 }, "totalOrders": 14, "totalSales": 350 },
    //         { "_id": { "year": 2024, "month": 12, "day": 4 }, "totalOrders": 11, "totalSales": 275 },
    //         { "_id": { "year": 2024, "month": 12, "day": 5 }, "totalOrders": 10, "totalSales": 250 },
    //         { "_id": { "year": 2024, "month": 12, "day": 6 }, "totalOrders": 13, "totalSales": 325 },
    //         { "_id": { "year": 2024, "month": 12, "day": 7 }, "totalOrders": 12, "totalSales": 300 },
    //         { "_id": { "year": 2024, "month": 12, "day": 8 }, "totalOrders": 15, "totalSales": 375 },
    //         { "_id": { "year": 2024, "month": 12, "day": 9 }, "totalOrders": 14, "totalSales": 350 },
    //         { "_id": { "year": 2024, "month": 12, "day": 10 }, "totalOrders": 16, "totalSales": 400 }
    //     ],
    //     "completedOrders": {
    //         "last10Days": [
    //             { "_id": { "year": 2024, "month": 12, "day": 1 }, "totalOrders": 5 },
    //             { "_id": { "year": 2024, "month": 12, "day": 2 }, "totalOrders": 6 },
    //             { "_id": { "year": 2024, "month": 12, "day": 4 }, "totalOrders": 7 },
    //             { "_id": { "year": 2024, "month": 12, "day": 5 }, "totalOrders": 7 },
    //             { "_id": { "year": 2024, "month": 12, "day": 6 }, "totalOrders": 7 },
    //             { "_id": { "year": 2024, "month": 12, "day": 7 }, "totalOrders": 7 }
    //         ],
    //         "monthly": [
    //             { "_id": { "year": 2024, "month": 12 }, "totalOrders": 50 },
    //             { "_id": { "year": 2024, "month": 11 }, "totalOrders": 60 }
    //         ],
    //         "yearly": [
    //             { "_id": 2024, "totalOrders": 500 },
    //             { "_id": 2023, "totalOrders": 450 }
    //         ]
    //     },
    //     "canceledOrders": {
    //         "last10Days": [
    //             { "_id": { "year": 2024, "month": 12, "day": 2 }, "totalOrders": 2 }
    //         ],
    //         "monthly": [
    //             { "_id": { "year": 2024, "month": 12 }, "totalOrders": 10 }
    //         ],
    //         "yearly": [
    //             { "_id": 2024, "totalOrders": 80 }
    //         ]
    //     },
    //     "statusDistribution": [
    //         { "_id": "completed", "count": 50 },
    //         { "_id": "canceled", "count": 20 },
    //         { "_id": "pending", "count": 30 }
    //     ],
    //     "totalOrders": 1500
    // }


    // Prepare data for different charts

    const monthlyOrderData = {
        totalOrders: order?.monthlyTotalOrders?.map(item => ({
            label: `${item._id.month}/${item._id.year}`,
            orders: item.totalOrders,
            sales: item.totalSales
        })).reverse(),

        completedOrders: order?.completedOrders?.monthly?.map(item => ({
            label: `${item._id.month}/${item._id.year}`,
            orders: item.totalOrders,
        })).reverse(),

        canceledOrders: order?.canceledOrders?.monthly?.map(item => ({
            label: `${item._id.month}/${item._id.year}`,
            orders: item.totalOrders,
        })).reverse(),

    }

    const last10DaysOrderDat = {
        totalOrders: order?.last10DaysTotalOrders?.map(item => ({
            label: `${item._id.day}/${item._id.month}/${item._id.year}`,
            orders: item.totalOrders,
            sales: item.totalSales
        })),
        completedOrders: order?.completedOrders?.last10Days?.map(item => ({
            label: `${item._id.day}/${item._id.month}/${item._id.year}`,
            orders: item.totalOrders,
        })),
        canceledOrders: order?.canceledOrders?.last10Days?.map(item => ({
            label: `${item._id.day}/${item._id.month}/${item._id.year}`,
            orders: item.totalOrders,
        }))
    }

    const yearlyData = {
        totalOrders: order?.yearlyTotalOrders?.map(item => ({
            label: `${item._id}`,
            orders: item.totalOrders,
            sales: item.totalSales
        })),
        completedOrders: order?.completedOrders?.yearly?.map(item => ({
            label: `${item._id}`,
            orders: item.totalOrders,
        })),
        canceledOrders: order?.canceledOrders?.yearly?.map(item => ({
            label: `${item._id}`,
            orders: item.totalOrders,
        }))
    }

    const [selectedTimeLine, setSelectedTimeLine] = useState('monthly');

    const getOrderOverviewDataForTimeLine = () => {
        switch (selectedTimeLine) {
            case 'monthly': return monthlyOrderData.totalOrders;
            case 'last10Day': return last10DaysOrderDat.totalOrders;
            case 'yearly': return yearlyData.totalOrders;
            default: return monthlyOrderData.totalOrders;
        }
    };
    const getCompleteOrderDataForTimeLine = () => {
        let data = monthlyOrderData.completedOrders;
        switch (selectedTimeLine) {
            case 'monthly':
                data = monthlyOrderData.completedOrders;
                break;
            case 'last10Day':
                data = last10DaysOrderDat.completedOrders;
                break;
            case 'yearly':
                data = yearlyData.completedOrders;
                break;
            default:
                data = monthlyOrderData.completedOrders;
                break;
        }
        // handleIsFlex()
        return data
    };
    const getCaneledOrderDataForTimeLine = () => {
        let data = monthlyOrderData.canceledOrders;
        switch (selectedTimeLine) {
            case 'monthly':
                data = monthlyOrderData.canceledOrders;
                break;
            case 'last10Day':
                data = last10DaysOrderDat.canceledOrders;
                break;
            case 'yearly':
                data = yearlyData.canceledOrders;
                break;
            default:
                data = monthlyOrderData.canceledOrders;
                break;
        }
        // handleIsFlex()
        return data;
    };

    const COLORS = [
        '#3B82F6', '#10B981', '#6366F1',
        '#F43F5E', '#8B5CF6'
    ];

    if (!order) return <OrderDashboardSkeleton />;

    return (
        <div className="min-h-screen p-6">
            <div className="mx-auto">
                <div className='sticky top-[-10px] z-20 bg-blue-800 rounded-lg'>
                    <h1 className="text-3xl p-4 font-bold text-white mb-6">Order Analytics</h1>
                </div>

                <div className='flex'>
                    {/* Overview Cards */}
                    <div className="grid w-1/2 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-lg flex shadow items-center space-x-4">
                            <Package className="text-blue-500 w-12 h-12" />
                            <div>
                                <p className="text-gray-500">Total Orders</p>
                                <p className="text-2xl font-bold text-blue-800">{order.totalOrders}</p>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-4">
                            <DollarSign className="text-green-500 w-12 h-12" />
                            <div>
                                <p className="text-gray-500">Total Sales</p>
                                <p className="text-2xl font-bold text-green-800">R{order.totalSales}</p>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-4">
                            <TrendingUp className="text-purple-500 w-12 h-12" />
                            <div>
                                <p className="text-gray-500">Growth</p>
                                <p className="text-2xl font-bold text-purple-800">{order.orderGrowth}%</p>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-4">
                            <ShoppingCart className="text-indigo-500 w-12 h-12" />
                            <div>
                                <p className="text-gray-500">Avg. Order Value</p>
                                <p className="text-2xl font-bold text-indigo-800">R{order.averageOrderValue}</p>
                            </div>
                        </div>
                    </div>

                    {/* Order Status Distribution Pie Chart */}
                    <div className="w-1/2 bg-white p-4 mb-6 mx-2 rounded-lg shadow mb-4">
                        <div className=''>
                            <h2 className="text-center text-xl font-semibold text-blue-700">Order Status</h2>
                            <PieChart width={300} height={400} className='mx-auto'>
                                <Pie
                                    data={order.statusDistribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={true}
                                    outerRadius={150}
                                    fill="#8884d8"
                                    dataKey="count"
                                >
                                    {order?.statusDistribution?.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </div>
                    </div>

                </div>


                {/* Charts Section */}
                <div className="">
                    {/* Monthly Orders Line Chart */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="sticky top-16 z-10 bg-gray-200 p-4 rounded-lg flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-blue-700">
                                {selectedTimeLine.charAt(0).toUpperCase() + selectedTimeLine.slice(1)} Order Analysis
                            </h2>
                            <div className="space-x-2">
                                {['monthly', 'last10Day', 'yearly'].map((timeline) => (
                                    <button
                                        key={timeline}
                                        onClick={() => setSelectedTimeLine(timeline)}
                                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${selectedTimeLine === timeline
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                            }`}
                                    >
                                        {timeline.charAt(0).toUpperCase() + timeline.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <ResponsiveContainer width="100%" height={300}>
                            <h3 className="text-lg font-semibold text-center text-blue-700">
                                Order Overview
                            </h3>
                            <LineChart data={getOrderOverviewDataForTimeLine()}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                                <XAxis dataKey="label" className="text-sm" />
                                <YAxis className="text-sm" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#F3F4F6',
                                        borderRadius: '0.5rem',
                                        border: 'none',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="orders"
                                    stroke="#3B82F6"
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="#10B981"
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>

                        <div className={`flex ${((getCompleteOrderDataForTimeLine().length > 5) || (getCaneledOrderDataForTimeLine().length > 5)) ? "flex-col" : ""}`}>

                            <ResponsiveContainer width={((getCompleteOrderDataForTimeLine().length > 5) || (getCaneledOrderDataForTimeLine().length > 5)) ? "100%" : "50%"} height={300} className="mt-16">
                                <h3 className="text-lg font-semibold text-center text-blue-700">
                                    Completed Order Overview
                                </h3>
                                <LineChart data={getCompleteOrderDataForTimeLine()}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                                    <XAxis dataKey="label" className="text-sm" />
                                    <YAxis className="text-sm" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#F3F4F6',
                                            borderRadius: '0.5rem',
                                            border: 'none',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }}
                                    />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="orders"
                                        stroke="#3B82F6"
                                        strokeWidth={2}
                                        dot={{ r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>

                            <ResponsiveContainer width={((getCompleteOrderDataForTimeLine().length > 5) || (getCaneledOrderDataForTimeLine().length > 5)) ? "100%" : "50%"} height={300} className="mt-16">
                                <h3 className="text-lg font-semibold text-center text-blue-700">
                                    Canceled Order Overview
                                </h3>
                                <LineChart data={getCaneledOrderDataForTimeLine()}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                                    <XAxis dataKey="label" className="text-sm" />
                                    <YAxis className="text-sm" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#F3F4F6',
                                            borderRadius: '0.5rem',
                                            border: 'none',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }}
                                    />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="orders"
                                        stroke="#3B82F6"
                                        strokeWidth={2}
                                        dot={{ r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>

                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default OrderDashboard;