const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Product = require('../models/Product');
const Order = require('../models/Order');

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'YOUR_KEY_ID',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'YOUR_KEY_SECRET',
});

// @route   POST /api/payment/orders
// @desc    Create a Razorpay order
router.post('/orders', async (req, res) => {
  try {
    const { orderItems, userEmail, currency = 'INR', receipt } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items provided' });
    }

    // Securely calculate subtotal from DB
    let computedSubtotal = 0;
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }
      computedSubtotal += product.price * item.qty;
    }

    // Securely calculate discount
    let isFirstOrder = false;
    let query = { $or: [] };
    if (userEmail) query.$or.push({ 'shippingAddress.email': userEmail });
    
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

    const computedTotal = computedSubtotal - (computedSubtotal * discountPercentage);
    const amountInPaise = Math.round(computedTotal * 100);

    if (amountInPaise < 100) {
      return res.status(400).json({ message: 'Amount must be at least 100 paise (1 INR)' });
    }

    const options = {
      amount: amountInPaise,
      currency,
      receipt,
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).send('Error creating Razorpay order');
    }

    res.json({ ...order, backendCalculatedTotal: computedTotal });
  } catch (error) {
    console.error('Razorpay Error:', error);
    if (error.statusCode === 401) {
      return res.status(401).send('Unauthorized: Invalid Razorpay Credentials');
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/payment/verify
// @desc    Verify Razorpay payment signature
router.post('/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing payment verification fields' });
    }

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'YOUR_KEY_SECRET')
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      // Payment is verified
      return res.status(200).json({ message: 'Payment verified successfully' });
    } else {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }
  } catch (error) {
    console.error('Razorpay Verify Error:', error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
