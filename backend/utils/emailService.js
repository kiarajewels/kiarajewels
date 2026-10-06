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

module.exports = {
  sendOrderStatusEmail,
  sendReviewRequestEmail
};
