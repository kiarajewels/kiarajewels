const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const OTP = require('../models/OTP');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const ADMIN_EMAIL = 'kiarajewels.co@gmail.com';

// @route   POST /api/dashboard/login
// @desc    Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (email !== ADMIN_EMAIL) {
      return res.status(401).json({ message: 'Invalid admin email' });
    }

    const adminUser = await User.findOne({ email: ADMIN_EMAIL });
    
    if (!adminUser || !adminUser.password) {
      return res.status(401).json({ message: 'Password not set. Please use First Time Setup.' });
    }

    if (await adminUser.matchPassword(password)) {
      const token = jwt.sign({ role: 'admin', id: adminUser._id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
      });
      res.json({ token, email: adminUser.email });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/dashboard/request-reset
// @desc    Request OTP to set or reset password
router.post('/request-reset', async (req, res) => {
  try {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.deleteMany({ email: ADMIN_EMAIL });
    await OTP.create({ email: ADMIN_EMAIL, otp: otpCode });

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log(`\n=== MOCK ADMIN OTP ===\nOTP: ${otpCode}\n======================\n`);
      return res.status(200).json({ message: 'OTP logged to server console (SMTP not configured)' });
    }

    const mailOptions = {
      from: `"Kiara Jewels Admin" <${process.env.EMAIL_USER}>`,
      to: ADMIN_EMAIL,
      subject: 'Admin Panel - Password Setup OTP',
      html: `<h2>Admin Panel OTP</h2><p>Your OTP to set/reset the admin password is: <strong style="font-size: 24px;">${otpCode}</strong></p><p>This OTP expires in 5 minutes.</p>`
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'OTP sent to admin email' });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// @route   POST /api/dashboard/set-password
// @desc    Verify OTP and set new password
router.post('/set-password', async (req, res) => {
  try {
    const { otp, newPassword } = req.body;
    
    if (!otp || !newPassword) {
      return res.status(400).json({ message: 'OTP and new password are required' });
    }

    const record = await OTP.findOne({ email: ADMIN_EMAIL, otp });
    if (!record) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // OTP is valid
    await OTP.deleteOne({ _id: record._id });

    let adminUser = await User.findOne({ email: ADMIN_EMAIL });
    if (!adminUser) {
      adminUser = new User({
        name: 'Super Admin',
        email: ADMIN_EMAIL,
        isAdmin: true,
      });
    }

    adminUser.password = newPassword;
    await adminUser.save(); // Hashed automatically by pre-save hook

    const token = jwt.sign({ role: 'admin', id: adminUser._id }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '30d',
    });

    res.json({ token, email: adminUser.email, message: 'Password set successfully!' });
  } catch (error) {
    console.error("Error setting password:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

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
