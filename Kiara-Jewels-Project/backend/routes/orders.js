const express = require('express');
const Order = require('../models/Order');
const User = require('../models/User');
const router = express.Router();

// @route   GET /api/orders
// @desc    Get all orders (Admin)
router.get('/', async (req, res) => {
  try {
    const status = req.query.status;
    const filter = status && status !== 'All' ? { status } : {};
    
    // Populate user and product details
    const orders = await Order.find(filter)
      .populate('user', 'id name email createdAt')
      .sort({ createdAt: -1 });
      
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/orders/myorders
// @desc    Get user's orders
router.get('/myorders', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Populate the product details in orderItems so we can check availability and get latest price
    const orders = await Order.find({ user: user._id })
      .populate('orderItems.product')
      .sort({ createdAt: -1 });
      
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status (Admin)
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (order) {
      order.status = status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/orders/check-first-order
// @desc    Check if email or mobile is a first-time buyer
router.get('/check-first-order', async (req, res) => {
  try {
    const { email, mobile } = req.query;
    if (!email && !mobile) {
      return res.json({ isFirstOrder: true });
    }
    
    let query = { $or: [] };
    if (email) query.$or.push({ 'shippingAddress.email': email });
    if (mobile) query.$or.push({ 'shippingAddress.mobile': mobile });
    
    const count = await Order.countDocuments(query);
    res.json({ isFirstOrder: count === 0 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/orders
// @desc    Create new order (Frontend Checkout)
router.post('/', async (req, res) => {
  try {
    const { 
      orderItems, 
      shippingAddress, 
      paymentMethod, 
      itemsPrice, 
      taxPrice, 
      shippingPrice, 
      totalPrice 
    } = req.body;

    const userEmail = req.body.userEmail;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    let userId = '64a0f44358a9e8b948a0f9b0'; // Fallback mock ID
    if (userEmail) {
      const dbUser = await User.findOne({ email: userEmail });
      if (dbUser) {
        userId = dbUser._id;
      }
    }

    // Securely calculate total price
    const computedSubtotal = orderItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
    
    let isFirstOrder = false;
    let query = { $or: [] };
    if (userEmail) query.$or.push({ 'shippingAddress.email': userEmail });
    if (shippingAddress && shippingAddress.mobile) query.$or.push({ 'shippingAddress.mobile': shippingAddress.mobile });
    
    if (query.$or.length > 0) {
      const pastOrders = await Order.countDocuments(query);
      if (pastOrders === 0) isFirstOrder = true;
    } else {
      isFirstOrder = true;
    }

    let discountPercentage = 0;
    if (isFirstOrder) {
      discountPercentage = 0.10;
    } else if (computedSubtotal >= 6000) {
      discountPercentage = 0.10;
    } else if (computedSubtotal >= 3000) {
      discountPercentage = 0.05;
    }

    const computedTotal = computedSubtotal - (computedSubtotal * discountPercentage) + (taxPrice || 0) + (shippingPrice || 0);

    const order = new Order({
      user: userId,
      orderItems,
      shippingAddress,
      paymentMethod,
      taxPrice,
      shippingPrice,
      totalPrice: computedTotal,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message, stack: error.stack });
  }
});

module.exports = router;
