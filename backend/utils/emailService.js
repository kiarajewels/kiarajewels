const nodemailer = require('nodemailer');
const EmailLog = require('../models/EmailLog');
const Order = require('../models/Order');

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

const sendEmailSafely = async (orderId, customerEmail, emailType, subject, htmlContent) => {
  try {
    // Idempotency Check
    const existingLog = await EmailLog.findOne({ order: orderId, emailType, status: 'SENT' });
    if (existingLog) {
      console.log(`Email of type ${emailType} already sent for order ${orderId}. Skipping.`);
      return false; // Already sent
    }

    const mailOptions = {
      from: `"Kiara Jewels" <${process.env.EMAIL_USER}>`,
      to: customerEmail,
      subject,
      html: htmlContent
    };

    let result;
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      result = await transporter.sendMail(mailOptions);
    } else {
      console.log(`\n=== MOCK EMAIL (${emailType}) ===\nTo: ${customerEmail}\nSubject: ${subject}\n===============================\n`);
      result = { messageId: 'mock-id-' + Date.now() };
    }

    await EmailLog.create({
      order: orderId,
      customerEmail,
      emailType,
      status: 'SENT',
      providerMessageId: result.messageId
    });

    return true;

  } catch (error) {
    console.error(`Failed to send ${emailType} email:`, error);
    await EmailLog.create({
      order: orderId,
      customerEmail,
      emailType,
      status: 'FAILED',
      error: error.message
    });
    return false;
  }
};

const sendOrderStatusEmail = async (order, newStatus) => {
  const customerEmail = order.shippingAddress?.email || (order.user && order.user.email);
  if (!customerEmail) return;

  const customerName = order.shippingAddress?.firstName || 'Customer';
  const orderIdStr = order._id.toString();
  let subject = '';
  let emailType = '';
  let customMessage = '';

  const productsListHtml = order.orderItems.map(item => 
    `<li>${item.qty}x ${item.name}</li>`
  ).join('');

  if (newStatus === 'Processing') {
    subject = 'Your Kiara Jewels Order Is Being Processed';
    emailType = 'ORDER_PROCESSING';
    customMessage = 'We are currently preparing and processing your order. It will be dispatched soon.';
  } else if (newStatus === 'In-Transit') {
    subject = 'Your Kiara Jewels Order Is On Its Way';
    emailType = 'ORDER_IN_TRANSIT';
    customMessage = `Your order is on its way to you!`;
  } else if (newStatus === 'Delivered') {
    subject = 'Your Kiara Jewels Order Has Been Delivered';
    emailType = 'ORDER_DELIVERED';
    customMessage = `Your order has been delivered on ${new Date().toLocaleDateString()}. Thank you for choosing Kiara Jewels!`;
  } else {
    return;
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="text-align: center; color: #000;">${subject}</h2>
      <p>Hi ${customerName},</p>
      <p>${customMessage}</p>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="margin-top: 0;">Order Details</h3>
        <p><strong>Order ID:</strong> ${orderIdStr}</p>
        <p><strong>Status:</strong> ${newStatus}</p>
        <p><strong>Items:</strong></p>
        <ul>${productsListHtml}</ul>
      </div>

      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #777;">
        <p>If you have any questions, contact us at ${process.env.EMAIL_USER}</p>
      </div>
    </div>
  `;

  await sendEmailSafely(orderIdStr, customerEmail, emailType, subject, htmlContent);
};

const sendReviewRequestEmail = async (order) => {
  const customerEmail = order.shippingAddress?.email || (order.user && order.user.email);
  if (!customerEmail) return;

  const customerName = order.shippingAddress?.firstName || 'Customer';
  const orderIdStr = order._id.toString();
  const subject = 'How did you like your jewellery?';
  const emailType = 'REVIEW_REQUEST';
  
  let productsHtml = '';
  const frontendUrl = process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace('5000', '3000') : 'http://localhost:3000'; // Assuming frontend runs on 3000 locally
  // Wait, production frontend URL should be handled better, maybe use a NEXT_PUBLIC_FRONTEND_URL env var if it existed. But for now we just use a generic way or assume kiarajewels.co
  const domain = process.env.NODE_ENV === 'production' ? 'https://www.kiarajewels.co' : 'http://localhost:3000';

  for (const item of order.orderItems) {
    productsHtml += `
      <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #eee;">
        <img src="${item.image}" alt="${item.name}" style="width: 150px; height: 150px; object-fit: cover; border-radius: 8px; margin-bottom: 15px;" />
        <h3 style="margin: 0 0 15px 0;">${item.name}</h3>
        <a href="${domain}/product/${item.product}?review=true&order=${orderIdStr}" style="display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; font-weight: bold; letter-spacing: 1px; border-radius: 4px;">WRITE A REVIEW</a>
      </div>
    `;
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h1 style="text-align: center; font-family: 'Times New Roman', serif; letter-spacing: 2px;">KIARA JEWELS</h1>
      <h2 style="text-align: center; font-weight: normal; margin-top: 30px;">How did you like your jewellery?</h2>
      <p style="text-align: center; margin-bottom: 40px;">Your piece has arrived. We'd love to know what you think.</p>
      
      ${productsHtml}

      <div style="margin-top: 40px; text-align: center; color: #777;">
        <p>Thank you for choosing Kiara Jewels.</p>
        <p>Need help? Contact us at ${process.env.EMAIL_USER}</p>
      </div>
    </div>
  `;

  await sendEmailSafely(orderIdStr, customerEmail, emailType, subject, htmlContent);
};

const sendAdminNewOrderAlertEmail = async (order) => {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || process.env.EMAIL_USER || 'kiarajewels.co@gmail.com';
  if (!adminEmail) return;

  const orderIdStr = order._id.toString();
  const orderShortId = orderIdStr.slice(-8).toUpperCase();
  const customerName = [order.shippingAddress?.firstName, order.shippingAddress?.lastName].filter(Boolean).join(' ') || (order.user && order.user.name) || 'Customer';
  const customerEmail = order.shippingAddress?.email || (order.user && order.user.email) || 'N/A';
  const customerMobile = order.shippingAddress?.mobile || order.shippingAddress?.phone || 'N/A';
  const shippingAddressText = [
    order.shippingAddress?.address,
    order.shippingAddress?.city,
    order.shippingAddress?.postalCode,
    order.shippingAddress?.country || 'India'
  ].filter(Boolean).join(', ');

  const subject = `🚨 New Order Alert: #${orderShortId} (₹${order.totalPrice ? order.totalPrice.toFixed(2) : '0.00'}) - ${customerName}`;
  const emailType = 'ADMIN_NEW_ORDER_ALERT';

  let itemsHtml = '';
  if (Array.isArray(order.orderItems)) {
    for (const item of order.orderItems) {
      itemsHtml += `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; vertical-align: middle;">
            ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width: 48px; height: 48px; object-fit: cover; border-radius: 6px; display: block;" />` : ''}
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: 500; color: #111827;">${item.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center; color: #4b5563;">x${item.qty}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600; color: #111827;">₹${item.price ? item.price.toFixed(2) : '0.00'}</td>
        </tr>
      `;
    }
  }

  const adminUrl = process.env.NODE_ENV === 'production' 
    ? 'https://admin.kiarajewels.co/orders' 
    : 'http://localhost:5173/orders';

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #000000; color: #ffffff; padding: 24px; text-align: center;">
        <h1 style="margin: 0; font-size: 1.5rem; letter-spacing: 2px;">KIARA JEWELS</h1>
        <p style="margin: 6px 0 0 0; font-size: 0.9rem; color: #d1d5db;">Admin Order Alert</p>
      </div>

      <div style="padding: 24px;">
        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 14px 16px; margin-bottom: 20px;">
          <h2 style="margin: 0 0 4px 0; font-size: 1.1rem; color: #15803d;">🎉 A new order has been placed!</h2>
          <p style="margin: 0; font-size: 0.875rem; color: #166534;">Order <strong>#${orderShortId}</strong> is waiting for fulfillment.</p>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <div style="background-color: #f9fafb; padding: 14px; border-radius: 6px; border: 1px solid #f3f4f6; margin-bottom: 16px;">
            <h3 style="margin: 0 0 8px 0; font-size: 0.85rem; text-transform: uppercase; color: #6b7280; letter-spacing: 0.05em;">Customer Information</h3>
            <p style="margin: 4px 0; font-size: 0.9rem; color: #111827;"><strong>Name:</strong> ${customerName}</p>
            <p style="margin: 4px 0; font-size: 0.9rem; color: #111827;"><strong>Email:</strong> <a href="mailto:${customerEmail}" style="color: #2563eb; text-decoration: none;">${customerEmail}</a></p>
            <p style="margin: 4px 0; font-size: 0.9rem; color: #111827;"><strong>Phone:</strong> ${customerMobile}</p>
            <p style="margin: 4px 0; font-size: 0.9rem; color: #111827;"><strong>Shipping Address:</strong> ${shippingAddressText || 'N/A'}</p>
          </div>
        </div>

        <h3 style="margin: 16px 0 8px 0; font-size: 0.85rem; text-transform: uppercase; color: #6b7280; letter-spacing: 0.05em;">Ordered Items</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 0.875rem;">
          <thead>
            <tr style="background-color: #f9fafb; text-align: left; color: #6b7280;">
              <th style="padding: 8px 10px; border-bottom: 1px solid #e5e7eb;">Item</th>
              <th style="padding: 8px 10px; border-bottom: 1px solid #e5e7eb;">Product</th>
              <th style="padding: 8px 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">Qty</th>
              <th style="padding: 8px 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="background-color: #f9fafb; padding: 14px; border-radius: 6px; margin-bottom: 24px; text-align: right;">
          <p style="margin: 4px 0; font-size: 0.9rem; color: #4b5563;">Payment Method: <strong>${order.paymentMethod || 'Razorpay'}</strong></p>
          <p style="margin: 6px 0 0 0; font-size: 1.25rem; font-weight: bold; color: #111827;">Total Amount: ₹${order.totalPrice ? order.totalPrice.toFixed(2) : '0.00'}</p>
        </div>

        <div style="text-align: center; margin: 30px 0 10px 0;">
          <a href="${adminUrl}" style="background-color: #000000; color: #ffffff; padding: 14px 32px; font-size: 0.95rem; font-weight: 600; text-decoration: none; border-radius: 6px; display: inline-block;">
            Open Orders in Admin Panel →
          </a>
        </div>
      </div>

      <div style="background-color: #f9fafb; border-top: 1px solid #e5e7eb; padding: 16px; text-align: center; font-size: 0.75rem; color: #9ca3af;">
        Kiara Jewels Store Management • Automatic System Notification
      </div>
    </div>
  `;

  await sendEmailSafely(orderIdStr, adminEmail, emailType, subject, htmlContent);
};

module.exports = {
  transporter,
  sendEmailSafely,
  sendOrderStatusEmail,
  sendReviewRequestEmail,
  sendAdminNewOrderAlertEmail
};
