const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const nodemailer = require('nodemailer');
const router = express.Router();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

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

// @route   GET /api/orders/:id
// @desc    Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
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
    const order = await Order.findById(req.params.id).populate('user');
    
    if (order) {
      const oldStatus = order.status;
      order.status = status;
      
      // Update deliveredAt if transitioning to Delivered
      if (status === 'Delivered' && oldStatus !== 'Delivered') {
         order.deliveredAt = Date.now();
      }

      const updatedOrder = await order.save();
      
      // Send Email ONLY on real status change
      if (oldStatus !== status) {
        const { sendOrderStatusEmail } = require('../utils/emailService');
        // Do not await if you want to respond faster, but awaiting is safer for logging
        sendOrderStatusEmail(updatedOrder, status).catch(console.error);
      }

      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
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

    // Securely calculate total price from DB
    let computedSubtotal = 0;
    const finalOrderItems = [];
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) throw new Error(`Product not found: ${item.product}`);
      computedSubtotal += product.price * item.qty;
      finalOrderItems.push({
        ...item,
        name: product.name,
        image: product.media && product.media.length > 0 ? product.media[0].url : '',
        price: product.price // Override frontend price with true DB price
      });
    }
    
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
      orderItems: finalOrderItems,
      shippingAddress,
      paymentMethod,
      taxPrice,
      shippingPrice,
      totalPrice: computedTotal,
    });

    const createdOrder = await order.save();

    // Send Email Receipt
    try {
      if (shippingAddress && shippingAddress.email) {
        let itemsHtml = '';
        for (const item of finalOrderItems) {
          itemsHtml += `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" />
              </td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.qty}</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">₹${item.price}</td>
            </tr>
          `;
        }

        const mailOptions = {
          from: `"Kiara Jewels" <${process.env.EMAIL_USER}>`,
          to: shippingAddress.email,
          subject: `Order Confirmation - ${createdOrder._id}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
              <h2 style="text-align: center; color: #000;">Thank you for your order!</h2>
              <p>Hi ${shippingAddress.firstName},</p>
              <p>We've received your order and are getting it ready to be shipped. We will notify you when it's on its way!</p>
              
              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="margin-top: 0;">Order Summary</h3>
                <p><strong>Order ID:</strong> ${createdOrder._id}</p>
                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
              </div>

              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <thead>
                  <tr style="background-color: #f2f2f2; text-align: left;">
                    <th style="padding: 10px; border-bottom: 2px solid #ddd;">Item</th>
                    <th style="padding: 10px; border-bottom: 2px solid #ddd;">Name</th>
                    <th style="padding: 10px; border-bottom: 2px solid #ddd;">Qty</th>
                    <th style="padding: 10px; border-bottom: 2px solid #ddd;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <div style="text-align: right; font-size: 16px;">
                <p><strong>Subtotal:</strong> ₹${computedSubtotal}</p>
                <p><strong>Discount:</strong> ${discountPercentage * 100}%</p>
                <p><strong>Total:</strong> ₹${computedTotal}</p>
              </div>

              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #777;">
                <p>If you have any questions, reply to this email or contact us at kiarajewels.co@gmail.com</p>
              </div>
            </div>
          `
        };

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
          transporter.sendMail(mailOptions).catch(err => console.error("Email send error:", err));
        } else {
          console.log(`\n=== MOCK ORDER RECEIPT EMAIL ===\nTo: ${shippingAddress.email}\nSubject: Order Confirmation - ${createdOrder._id}\n===============================\n`);
        }
      }
    } catch (emailError) {
      console.error("Failed to send order confirmation email:", emailError);
    }

    // Meta Conversions API
    try {
      if (process.env.META_PIXEL_ID && process.env.META_CAPI_TOKEN) {
        const eventId = createdOrder._id.toString();
        const emailToHash = shippingAddress.email || userEmail || '';
        
        await axios.post(`https://graph.facebook.com/v18.0/${process.env.META_PIXEL_ID}/events?access_token=${process.env.META_CAPI_TOKEN}`, {
          data: [{
            event_name: 'Purchase',
            event_time: Math.floor(Date.now() / 1000),
            event_id: eventId,
            action_source: 'website',
            user_data: {
              em: emailToHash ? [crypto.createHash('sha256').update(emailToHash.toLowerCase().trim()).digest('hex')] : [],
              ph: shippingAddress.mobile ? [crypto.createHash('sha256').update(shippingAddress.mobile.replace(/\D/g, '')).digest('hex')] : []
            },
            custom_data: {
              currency: 'INR',
              value: computedTotal,
              content_ids: finalOrderItems.map(item => item.product.toString()),
              content_type: 'product'
            }
          }]
        });
      }
    } catch (capiErr) {
      console.error("Meta CAPI Error:", capiErr.response?.data || capiErr.message);
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message, stack: error.stack });
  }
});

module.exports = router;
