import React, { useEffect, useState } from 'react';
import dashboardServices from "../../../services/dashboardServices"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import CustomerDashboardSkeleton from '../SkeletonLoading/CustomerDashboardSkeleton ';

const CustomerDashboard = () => {
    // Customer data

    const [customers, setcustomers] = useState(null)

    useEffect(() => {
        fetchcustomers()
    }, [])

    const fetchcustomers = async () => {
        try {
            const respons = await dashboardServices.getStatistics("customers");
            setcustomers(respons.customers)
        } catch (error) {
            setcustomers(null)
        }
    }

    // const customers = {
    //     customerGrowth: [
    //         { _id: { year: 2024, month: 12 }, customerCount: 1 },
    //         { _id: { year: 2025, month: 1 }, customerCount: 5 },
    //         { _id: { year: 2025, month: 2 }, customerCount: 3 },
    //         { _id: { year: 2025, month: 3 }, customerCount: 1 },
    //         { _id: { year: 2025, month: 4 }, customerCount: 2 },
    //     ],
    //     topCustomers: [
    //         {
    //             _id: '6753f71fba323bc7e7413353',
    //             totalSpent: 3791063,
    //             orderCount: 1,
    //             name: 'Himanshu sharma',
    //             email: 'sharmahimanshu6478@gmail.com'
    //         }
    //     ]
    // };

    const chartData = () => {
        return customers?.customerGrowth?.map(item => ({
            label: `${item._id.month}/${item._id.year}`,
            customers: item.customerCount,
        }))
    }

    if (!customers) return <CustomerDashboardSkeleton/>;

    return (
        <div className="min-h-screen p-6">
            <div className="container mx-auto">
                <div className='sticky top-[-10px] z-10 bg-blue-800 rounded-lg'>
                    <h1 className="text-3xl font-bold text-white mb-6 p-4">Customer Analytics</h1>
                </div>

                {/* Customer Growth Chart */}
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <ResponsiveContainer width="100%" height={300} className='mb-4'>
                        <h3 className="text-lg font-semibold text-center text-blue-700">
                            Customers Growth
                        </h3>
                        <LineChart data={chartData()}>
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
                                dataKey="customers"
                                stroke="#3B82F6"
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Top Customers Section */}
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <h2 className="text-2xl font-semibold text-blue-700 mb-4">Top Customers</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-blue-100">
                                    <th className="p-3 text-left text-blue-800">Name</th>
                                    <th className="p-3 text-left text-blue-800">Email</th>
                                    <th className="p-3 text-right text-blue-800">Total Spent</th>
                                    <th className="p-3 text-right text-blue-800">Order Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers?.topCustomers?.map((customer, index) => (
                                    <tr
                                        key={index}
                                        className="border-b border-blue-200 hover:bg-blue-50 transition-colors"
                                    >
                                        <td className="p-3 text-blue-900">{customer.name}</td>
                                        <td className="p-3 text-blue-700">{customer.email}</td>
                                        <td className="p-3 text-right text-blue-800">
                                            R{customer.totalSpent.toLocaleString()}
                                        </td>
                                        <td className="p-3 text-right text-blue-800">
                                            {customer.orderCount}
                                        </td>
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

export default CustomerDashboard;