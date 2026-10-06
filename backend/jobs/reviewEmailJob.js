const cron = require('node-cron');
const Order = require('../models/Order');
const EmailLog = require('../models/EmailLog');
const { sendReviewRequestEmail } = require('../utils/emailService');

// Run every hour
cron.schedule('0 * * * *', async () => {
  try {
    console.log('Running scheduled job: Check for Delivered orders needing Review Emails...');
    
    // Find orders delivered more than 24 hours ago
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const eligibleOrders = await Order.find({
      status: 'Delivered',
      deliveredAt: { $lte: twentyFourHoursAgo }, // Delivered at or before 24h ago
    }).populate('user');

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
      }
    }
  } catch (error) {
    console.error('Error in reviewEmailJob:', error);
  }
});
