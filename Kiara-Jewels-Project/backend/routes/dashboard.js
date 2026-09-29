const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @route   GET /api/dashboard/stats
// @desc    Get aggregated dashboard stats
// @access  Public (should be protected for Admin in production)
router.get('/stats', async (req, res) => {
  try {
    // 1. Total Revenue (sum of all placed orders, excluding cancelled)
    const revenueAggregation = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].total : 0;

    // 2. Active Products (Total catalog)
    const activeProducts = await Product.countDocuments();

    // 3. Total Customers (non-admin users)
    const totalCustomers = await User.countDocuments({ isAdmin: false });

    // 4. Orders Over Time (Daily, Weekly, Monthly, Quarterly, Yearly)
    const now = new Date();
    
    // Helper to get start of a period
    const getStartOfDay = () => {
      const d = new Date(now);
      d.setHours(0, 0, 0, 0);
      return d;
    };
    
    const getStartOfWeek = () => {
      const d = getStartOfDay();
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      return new Date(d.setDate(diff));
    };
    
    const getStartOfMonth = () => new Date(now.getFullYear(), now.getMonth(), 1);
    const getStartOfQuarter = () => {
      const quarter = Math.floor(now.getMonth() / 3);
      return new Date(now.getFullYear(), quarter * 3, 1);
    };
    const getStartOfYear = () => new Date(now.getFullYear(), 0, 1);

    const [dailyOrders, weeklyOrders, monthlyOrders, quarterlyOrders, yearlyOrders] = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: getStartOfDay() } }),
      Order.countDocuments({ createdAt: { $gte: getStartOfWeek() } }),
      Order.countDocuments({ createdAt: { $gte: getStartOfMonth() } }),
      Order.countDocuments({ createdAt: { $gte: getStartOfQuarter() } }),
      Order.countDocuments({ createdAt: { $gte: getStartOfYear() } }),
    ]);

    res.json({
      totalRevenue,
      activeProducts,
      totalCustomers,
      orders: {
        Daily: dailyOrders,
        Weekly: weeklyOrders,
        Monthly: monthlyOrders,
        Quarterly: quarterlyOrders,
        Yearly: yearlyOrders
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
