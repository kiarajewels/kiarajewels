const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');

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
    const { amount, currency = 'INR', receipt } = req.body;

    const options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency,
      receipt,
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).send('Error creating Razorpay order');
    }

    res.json(order);
  } catch (error) {
    console.error('Razorpay Error:', error);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/payment/verify
// @desc    Verify Razorpay payment signature
router.post('/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'YOUR_KEY_SECRET')
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      // Payment is verified
      // TODO: Update order status in the database
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
