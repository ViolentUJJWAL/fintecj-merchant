const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const Shop = require('../models/shopModel');
const Customer = require('../models/customerModel');

exports.getDashboardStatistics = async (req, res) => {
  try {
    const merchantId = req.user._id;

    // Define which chunks to fetch
    const { chunkType } = req.params;

    console.log(chunkType)

    // Define a response object
    let data = {};

    // Fetch data based on the requested chunk type
    switch (chunkType) {
      case "orders":
        data.orders = await aggregateOrderStatistics(merchantId);
        break;
      case "products":
        data.products = await aggregateProductStatistics(merchantId);
        break;
      case "shops":
        data.shops = await aggregateShopStatistics(merchantId);
        break;
      case "customers":
        data.customers = await aggregateCustomerStatistics(merchantId);
        break;
      default:
        return res.status(400).json({
          error: "Invalid chunk type. Use 'orders', 'products', 'shops', or 'customers'."
        });
    }

    return res.status(200).json({
      data
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: "Error fetching dashboard statistics"
    });
  }
};


// Order Statistics Aggregation
async function aggregateOrderStatistics(merchantId) {
  const today = new Date();
  const tenDaysAgo = new Date(today);
  tenDaysAgo.setDate(today.getDate() - 10);

  // Get the start of the current and previous month for growth calculation
  const startOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfPreviousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

  return {
    // Existing metrics
    monthlyTotalOrders: await Order.aggregate([
      { $match: { merchantId } },
      {
        $group: {
          _id: {
            year: { $year: "$orderDate" },
            month: { $month: "$orderDate" }
          },
          totalOrders: { $sum: 1 },
          totalSales: { $sum: "$totalAmount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]),

    yearlyTotalOrders: await Order.aggregate([
      { $match: { merchantId } },
      {
        $group: {
          _id: { $year: "$orderDate" },
          totalOrders: { $sum: 1 },
          totalSales: { $sum: "$totalAmount" }
        }
      },
      { $sort: { "_id": 1 } }
    ]),

    last10DaysTotalOrders: await Order.aggregate([
      { $match: { merchantId, orderDate: { $gte: tenDaysAgo } } },
      {
        $group: {
          _id: {
            year: { $year: "$orderDate" },
            month: { $month: "$orderDate" },
            day: { $dayOfMonth: "$orderDate" }
          },
          totalOrders: { $sum: 1 },
          totalSales: { $sum: "$totalAmount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
    ]),

    // Completed orders count (this month, this year, and last 10 days)
    completedOrders: {
      last10Days: await Order.aggregate([
        { $match: { merchantId, status: "Complete", orderDate: { $gte: tenDaysAgo } } },
        {
          $group: {
            _id: {
              year: { $year: "$orderDate" },
              month: { $month: "$orderDate" },
              day: { $dayOfMonth: "$orderDate" }
            },
            totalOrders: { $sum: 1 }
          }
        },
        { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
      ]),
      monthly: await Order.aggregate([
        { $match: { merchantId, status: "Complete" } },
        {
          $group: {
            _id: {
              year: { $year: "$orderDate" },
              month: { $month: "$orderDate" }
            },
            totalOrders: { $sum: 1 }
          }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
      ]),
      yearly: await Order.aggregate([
        { $match: { merchantId, status: "Complete" } },
        {
          $group: {
            _id: { $year: "$orderDate" },
            totalOrders: { $sum: 1 }
          }
        },
        { $sort: { "_id": 1 } }
      ])
    },

    // Canceled orders count (this month, this year, and last 10 days)
    canceledOrders: {
      last10Days: await Order.aggregate([
        { $match: { merchantId, status: "Reject", orderDate: { $gte: tenDaysAgo } } },
        {
          $group: {
            _id: {
              year: { $year: "$orderDate" },
              month: { $month: "$orderDate" },
              day: { $dayOfMonth: "$orderDate" }
            },
            totalOrders: { $sum: 1 }
          }
        },
        { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
      ]),
      monthly: await Order.aggregate([
        { $match: { merchantId, status: "Reject" } },
        {
          $group: {
            _id: {
              year: { $year: "$orderDate" },
              month: { $month: "$orderDate" }
            },
            totalOrders: { $sum: 1 }
          }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
      ]),
      yearly: await Order.aggregate([
        { $match: { merchantId, status: "Reject" } },
        {
          $group: {
            _id: { $year: "$orderDate" },
            totalOrders: { $sum: 1 }
          }
        },
        { $sort: { "_id": 1 } }
      ])
    },

    totalOrders: await Order.countDocuments({merchantId}),
    // Total Sales
    totalSales: await Order.aggregate([
      { $match: { merchantId } },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalAmount" }
        }
      }
    ]).then(result => (result[0] ? result[0].totalSales : 0)),

    // Average Order Value (AOV)
    averageOrderValue: await Order.aggregate([
      { $match: { merchantId } },
      {
        $group: {
          _id: null,
          averageOrderValue: { $avg: "$totalAmount" }
        }
      }
    ]).then(result => (result[0] ? result[0].averageOrderValue : 0)),

    // Order Growth (Month-over-Month)
    orderGrowth: await Order.aggregate([
      {
        $match: {
          merchantId,
          orderDate: { $gte: startOfPreviousMonth }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$orderDate" },
            month: { $month: "$orderDate" }
          },
          totalOrders: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]).then(results => {
      const previousMonth = results.find(
        r => r._id.year === startOfPreviousMonth.getFullYear() && r._id.month === startOfPreviousMonth.getMonth() + 1
      );
      const currentMonth = results.find(
        r => r._id.year === startOfCurrentMonth.getFullYear() && r._id.month === startOfCurrentMonth.getMonth() + 1
      );

      if (previousMonth && currentMonth) {
        return ((currentMonth.totalOrders - previousMonth.totalOrders) / previousMonth.totalOrders) * 100;
      } else {
        return 0; // No growth if data is insufficient
      }
    }),
    // Status distribution for the last 10 days
    statusDistribution: await Order.aggregate([
      { $match: { merchantId, orderDate: { $gte: tenDaysAgo } } },
      {
        $group: {
          _id: "$status",
          name: {$first: "$status"},
          count: { $sum: 1 }
        }
      }
    ]),
  };
}




// Product Statistics Aggregation
async function aggregateProductStatistics(merchantId) {
  // First, find the shops belonging to the merchant
  const merchantShops = await Shop.find({ merchantId }, '_id');
  const shopIds = merchantShops.map(shop => shop._id);

  return {
    // Stock distribution
    stockDistribution: await Product.aggregate([
      { $match: { shopId: { $in: shopIds } } },
      {
        $bucket: {
          groupBy: "$stock",
          boundaries: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, Infinity],
          default: "Other",
          output: {
            count: { $sum: 1 }
          }
        }
      }
    ]),

    // Top selling products
    topSellingProducts: await Product.aggregate([
      { $match: { shopId: { $in: shopIds } } },
      { $sort: { salesCount: -1 } },
      { $limit: 10 },
      {
        $project: {
          name: 1,
          salesCount: 1,
          stock: 1,
          price: 1
        }
      }
    ]),

    // Product category distribution
    categoryDistribution: await Product.aggregate([
      { $match: { shopId: { $in: shopIds } } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          totalStock: { $sum: "$stock" }
        }
      }
    ])
  };
}

// Shop Statistics Aggregation
async function aggregateShopStatistics(merchantId) {
  try {
    // Find shops belonging to the merchant
    const shops = await Shop.find({ merchantId });

    // Prepare data structures
    const productsPerShop = [];
    const timelineData = [];

    // Process each shop
    for (const shop of shops) {
      // Get product count
      const productCount = await Product.countDocuments({ shopId: shop._id });

      // Prepare products per shop
      productsPerShop.push({
        _id: shop._id,
        name: shop.name,
        productCount
      });

      // Generate timeline data (last 6 months)
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentDate = new Date();

      // Aggregate monthly data
      const monthlyData = await Order.aggregate([
        {
          $match: {
            merchantId,
            orderDate: {
              $gte: new Date(currentDate.getFullYear(), currentDate.getMonth() - 5, 1),
              $lte: currentDate
            }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: "$orderDate" },
              month: { $month: "$orderDate" }
            },
            totalProducts: { $sum: { $size: "$products" }},
            totalOrders: { $sum: 1 },
            totalRevenue: { $sum: "$totalAmount" }
          }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
      ]);

      // Fill timeline data for last 6 months
      for (let i = 11; i >= 0; i--) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const monthData = monthlyData.find(
          m => m._id.year === date.getFullYear() && m._id.month === (date.getMonth() + 1)
        );

        timelineData.push({
          month: monthNames[date.getMonth()],
          products: monthData ? monthData.totalProducts : 0,
          orders: monthData ? monthData.totalOrders : 0,
          revenue: monthData ? parseFloat(monthData.totalRevenue.toFixed(2)) : 0
        });
      }
    }

    return {
      productsPerShop,
      timelineData
    };
  } catch (error) {
    console.error('Error fetching shop dashboard data:', error);
    throw new Error('Unable to retrieve shop dashboard data');
  }
}

// Customer Statistics Aggregation
async function aggregateCustomerStatistics(merchantId) {
  return {
    // Customer acquisition over time
    customerGrowth: await Order.aggregate([
      { $match: { merchantId } },
      {
        $group: {
          _id: {
            year: { $year: "$orderDate" },
            month: { $month: "$orderDate" }
          },
          uniqueCustomers: { $addToSet: "$customerId" }
        }
      },
      {
        $project: {
          _id: 1,
          customerCount: { $size: "$uniqueCustomers" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]),

    // Top customers by total spending
    topCustomers: await Order.aggregate([
      { $match: { merchantId } },
      {
        $group: {
          _id: "$customerId",
          totalSpent: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 }
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
          id: "$customerDetails._id",
          name: "$customerDetails.name",
          email: "$customerDetails.email",
          totalSpent: 1,
          orderCount: 1
        }
      },
      { $sort: { totalSpent: -1 } },
    ])
  };
}