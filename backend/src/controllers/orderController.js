const Order = require("../models/orderModel"); // Adjust the path to the Order model
const mongoose = require("mongoose")

exports.getMerchantOrders = async (req, res) => {
  try {
    const merchantId = req.user._id;

    // Find and group orders by status for the given merchant
    const orders = await Order.aggregate([
      { $match: { merchantId } }, // Ensure merchantId is an ObjectId
      {
        $unwind: "$products", // Deconstruct the products array for lookup
      },
      {
        $lookup: {
          from: "products", // Name of the collection to join with
          localField: "products.productId", // Field in the orders collection
          foreignField: "_id", // Field in the products collection
          as: "productDetails", // Name of the new field to add
        },
      },
      {
        $unwind: "$productDetails", // Flatten the productDetails array
      },
      {
        $lookup: {
          from: "customers", // Name of the customers collection
          localField: "customerId", // Field in the orders collection
          foreignField: "_id", // Field in the customers collection
          pipeline: [
            {
              $project: {
                name: 1, // Include only name
                email: 1, // Include only email
                phoneNumber: 1, // Include only phoneNumber
                profile: 1, // Include only phoneNumber
                loyaltyPoints: 1, // Include only phoneNumber
                isVerified: 1, // Include only phoneNumber
                _id: 1, // Exclude the _id field
              },
            },
          ],
          as: "customerDetails", // Name of the new field to add
        },
      },
      {
        $unwind: "$customerDetails", // Flatten the customerDetails array
      },
      {
        $group: {
          _id: { status: "$status", orderId: "$orderId", orderDataTime: "$createdAt" }, // Group by status and orderId
          products: {
            $push: {
              product: "$productDetails",
              quantity: "$products.quantity",
            },
          }, // Include product details and quantity
          order_id: { $first: "$_id" },
          totalAmount: { $first: "$totalAmount" }, // Include the total price for each order
          customer: { $first: "$customerDetails" }, // Include customer details
          status: { $first: "$status" }, // Include customer details
        },
      },
      {
        $group: {
          _id: "$_id.status", // Regroup by status
          orders: {
            $push: {
              _id: "$order_id",
              orderId: "$_id.orderId",
              totalAmount: "$totalAmount",
              products: "$products",
              customer: "$customer",
              status: "$status",
              orderDataTime: "$_id.orderDataTime",
            },
          }, // Include grouped orders
          count: { $sum: 1 }, // Count the total orders for each status
        },
      },
      {
        $project: {
          _id: 0, // Exclude the _id field in the final output
          status: "$_id", // Rename _id to status
          orders: 1,
          count: 1,
        },
      },
    ]).sort({createdAt: -1});

    return res.status(200).json({ message: "Get order", data: orders });
  } catch (error) {
    console.error("Error fetching merchant orders:", error);
    return res.status(500).json({ error: "Unable to fetch orders" });
  }
};


exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log(id)

    // Validate the status value
    const validStatuses = ["New", "Preparing", "Picked Up", "Complete", "Reject"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }
    const order = await Order.findById(id);

    console.log(order)
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if(!(order.merchantId.equals(req.user._id))){
        return res.status(403).json({error : "You can not change other merchant order."})
    }

    // Update the status of the order
    order.status = status
    await order.save()

    return res.status(200).json({ message: "Order status updated", data: order });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({ error: "Unable to update order status" });
  }
};


exports.getLatestOrder = async (req, res) => {
  try {
    // Extract merchant ID from the authenticated user's token (assumes middleware sets req.user)
    const merchantId = req.user.id;

    // Find the latest order for the merchant
    const latestOrder = await Order.findOne({ merchantId })
      .sort({ createdAt: -1 }) // Sort by newest first
      .populate({
        path: "customerId",
        select: "name email", // Select basic customer info
      })
      .populate({
        path: "products.productId",
        select: "name price", // Select basic product info
      });

    // If no orders are found
    if (!latestOrder) {
      return res.status(404).json({ message: "No orders found for this merchant." });
    }

    // Respond with the latest order
    return res.status(200).json({
      message: "get latest order",
      data: latestOrder,
    });
  } catch (error) {
    console.error("Error fetching latest order:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch the latest order. Please try again later.",
    });
  }
};
