const Order = require('../models/orderModel');
const Customer = require('../models/customerModel');

exports.getCustomerInsights = async (req, res) => {
    try {
        const merchantId = req.user._id;

        // Aggregate total customer and order insights
        const totalInsights = await aggregateTotalInsights(merchantId);

        // Aggregate detailed customer purchase information
        const customerPurchaseDetails = await aggregateCustomerPurchaseDetails(merchantId);

        return res.status(200).json({
            success: true,
            data: {
                totalInsights,
                customerPurchaseDetails
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching customer insights',
            error: error.message
        });
    }
};

// Get total customers, orders, and average order value
async function aggregateTotalInsights(merchantId) {
    const insights = await Order.aggregate([
        { $match: { merchantId } },
        {
            $group: {
                _id: null,
                totalOrders: { $sum: 1 },
                totalAmount: { $sum: "$totalAmount" },
                uniqueCustomers: { $addToSet: "$customerId" }
            }
        },
        {
            $project: {
                totalCustomers: { $size: "$uniqueCustomers" },
                totalOrders: 1,
                totalAmount: 1,
                averageOrderValue: { $divide: ["$totalAmount", "$totalOrders"] }
            }
        }
    ]);

    return insights[0] || {
        totalCustomers: 0,
        totalOrders: 0,
        totalAmount: 0,
        averageOrderValue: 0
    };
}

// Get detailed customer purchase information
async function aggregateCustomerPurchaseDetails(merchantId) {
    return await Order.aggregate([
        { $match: { merchantId } },
        {
            $group: {
                _id: "$customerId",
                totalOrders: { $sum: 1 },
                totalAmount: { $sum: "$totalAmount" },
                totalProductsPurchased: { $sum: { $size: "$products" } },
                lastOrder: { $max: "$orderDate" }
            }
        },
        {
            $lookup: {
                from: "customers",
                localField: "_id",
                foreignField: "_id",
                as: "customerDetails"
            }
        },
        { $unwind: "$customerDetails" },
        {
            $project: {
                customerId: "$customerDetails._id",
                customerName: "$customerDetails.name",
                customerEmail: "$customerDetails.email",
                customerProfile: "$customerDetails.profile",
                totalOrders: 1,
                totalAmount: { $round: ["$totalAmount", 2] },
                totalProductsPurchased: 1,
                lastOrderDate: "$lastOrder",
                averageOrderValue: { $round: [{ $divide: ["$totalAmount", "$totalOrders"] }, 2] }
            }
        },
        { $sort: { totalAmount: -1 } }
    ]);
}

exports.getCustomerLastOrder = async (req, res) => {
    try {
        const merchantId = req.user._id;
        const customerId = req.params.customerId;

        const lastOrder = await Order.findOne({
            merchantId,
            customerId
        })
            .sort({ orderDate: -1 })
            .populate({
                path: 'products.productId',
                select: 'name price'
            });

        if (!lastOrder) {
            return res.status(404).json({
                success: false,
                message: 'No orders found for this customer'
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                orderId: lastOrder._id,
                orderDate: lastOrder.orderDate,
                totalAmount: lastOrder.totalAmount,
                status: lastOrder.status,
                products: lastOrder.products.map(item => ({
                    name: item.productId.name,
                    quantity: item.quantity,
                    price: item.productId.price
                }))
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching customer last order',
            error: error.message
        });
    }
};

exports.getCustomerOrderDetails = async (req, res) => {
    try {
        const merchantId = req.user._id;
        const customerId = req.params.id;

        const customer = await Customer.findById(customerId, 'name email phoneNumber');
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            });
        }

        // Detailed debugging queries
        const orderMatchQuery = {
            merchantId,
            customerId
        };

        // Fetch all orders without aggregation to debug
        const allOrders = await Order.find(orderMatchQuery);

        // If no orders found, return basic customer info
        if (allOrders.length === 0) {
            return res.status(200).json({
                success: true,
                data: {
                    customer: {
                        _id: customer._id,
                        name: customer.name,
                        email: customer.email,
                        phoneNumber: customer.phoneNumber
                    },
                    orderSummary: {
                        totalOrders: 0,
                        totalAmount: 0,
                        averageOrderValue: 0
                    },
                    orderHistory: []
                }
            });
        }

        // If orders exist, proceed with aggregation
        const orderDetails = await aggregateCustomerOrders(merchantId, customerId);
        const orderHistory = await fetchDetailedOrderHistory(merchantId, customerId);

        return res.status(200).json({
            success: true,
            data:{
                customer: {
                    _id: customer._id,
                    name: customer.name,
                    email: customer.email,
                    phoneNumber: customer.phoneNumber
                },
                orderSummary: {
                    totalOrders: orderDetails.totalOrders,
                    totalAmount: orderDetails.totalAmount,
                    averageOrderValue: orderDetails.averageOrderValue
                },
                orderHistory: orderHistory
            }
        });
    } catch (error) {
        console.error('Error in getCustomerOrderDetails:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching customer order details',
            error: error.message
        });
    }
};

// Simplified aggregation function
async function aggregateCustomerOrders(merchantId, customerId) {
    try {
        const orders = await Order.find({
            merchantId,
            customerId
        });

        const totalOrders = orders.length;
        const totalAmount = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        const averageOrderValue = totalOrders > 0 ? totalAmount / totalOrders : 0;

        return {
            totalOrders,
            totalAmount,
            averageOrderValue
        };
    } catch (error) {
        console.error('Error in aggregateCustomerOrders:', error);
        throw error;
    }
}

// Simplified order history function
async function fetchDetailedOrderHistory(merchantId, customerId) {
    try {
        const orders = await Order.find({
            merchantId,
            customerId
        }).populate({
            path: 'products.productId',
            select: 'name price images'
        }).sort({ orderDate: -1 });

        return orders.map(order => ({
            _id: order._id,
            orderId: order.orderId,
            totalAmount: order.totalAmount,
            status: order.status,
            orderDate: order.orderDate,
            products: order.products.map(prod => ({
                productId: prod.productId._id,
                quantity: prod.quantity,
                productName: prod.productId.name,
                productPrice: prod.productId.price
            }))
        }));
    } catch (error) {
        console.error('Error in fetchDetailedOrderHistory:', error);
        throw error;
    }
}
