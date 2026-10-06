const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const EmailLog = require('../models/EmailLog');
const { sendReviewRequestEmail } = require('../utils/emailService');

// @route   GET /api/cron/review-emails
// @desc    Trigger review emails (called by Vercel Cron or external scheduler)
router.get('/review-emails', async (req, res) => {
  try {
    // Optional: Add a secret key check to prevent unauthorized execution
    const authHeader = req.headers.authorization;
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    console.log('Running Vercel Cron: Check for Delivered orders needing Review Emails...');
    
    // Find orders delivered more than 24 hours ago
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const eligibleOrders = await Order.find({
      status: 'Delivered',
      deliveredAt: { $lte: twentyFourHoursAgo }, // Delivered at or before 24h ago
    }).populate('user');

    let emailsSent = 0;

    for (const order of eligibleOrders) {
      const customerEmail = order.shippingAddress?.email || (order.user && order.user.email);
      if (!customerEmail) continue;

      // Check if Review Email already sent
      const existingLog = await EmailLog.findOne({
        order: order._id,
        emailType: 'REVIEW_REQUEST',
        status: 'SENT'
      });

      if (!existingLog) {
        // Send Review Request
        await sendReviewRequestEmail(order);
        emailsSent++;
      }
    }

    res.status(200).json({ success: true, message: `Review emails triggered. Sent ${emailsSent} emails.` });
  } catch (error) {
    console.error('Error in cron review-emails:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
