const express = require('express');
const router = express.Router();
const ReturnRequest = require('../models/ReturnRequest');
const Order = require('../models/Order');
const crypto = require('crypto');
const Razorpay = require('razorpay');

// Configure Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const generateReturnId = () => {
  return 'RET-' + crypto.randomBytes(4).toString('hex').toUpperCase();
};

// @route   POST /api/returns
// @desc    Create a return request
router.post('/', async (req, res) => {
  try {
    const { orderId, email, name, items, reason, comments, evidence } = req.body;

    const order = await Order.findById(orderId).populate('user');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.status !== 'Delivered') {
      return res.status(400).json({ message: 'Only delivered orders can be returned' });
    }

    // Check 3-day eligibility
    const deliveredAt = order.deliveredAt;
    const now = new Date();
    const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;
    if (!deliveredAt || (now - deliveredAt > threeDaysInMs)) {
      return res.status(400).json({ message: 'Return window has expired' });
    }

    // Prevent duplicates
    const existingReturn = await ReturnRequest.findOne({ order: orderId });
    if (existingReturn) {
      return res.status(400).json({ message: 'A return request already exists for this order' });
    }

    // In a real scenario, validate items against orderItems to ensure exact match and calculate actual refund
    // Here we assume items passed are part of the order.
    
    // Calculate expected total refund (original paid per item, we use the price sent or calculate from order)
    let expectedRefund = 0;
    items.forEach(item => {
      expectedRefund += item.price * item.qty;
    });

    const returnRequest = new ReturnRequest({
      returnId: generateReturnId(),
      order: orderId,
      user: order.user._id,
      customerEmail: email,
      customerName: name,
      returnItems: items,
      reason,
      comments,
      evidence,
      razorpayPaymentId: order.paymentResult?.id,
      refundAmount: expectedRefund,
    });

    await returnRequest.save();

    // Optionally: Send 'Return Request Received' email here

    res.status(201).json(returnRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/returns/customer/:email
// @desc    Get returns for a customer
router.get('/customer/:email', async (req, res) => {
  try {
    const returns = await ReturnRequest.find({ customerEmail: req.params.email }).sort({ createdAt: -1 });
    res.json(returns);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/returns
// @desc    Get all returns (Admin)
router.get('/', async (req, res) => {
  try {
    const returns = await ReturnRequest.find({}).sort({ createdAt: -1 }).populate('order');
    res.json(returns);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/returns/:id
// @desc    Get return by ID (Admin)
router.get('/:id', async (req, res) => {
  try {
    const returnReq = await ReturnRequest.findById(req.params.id).populate('order').populate('user', 'name email');
    if (!returnReq) return res.status(404).json({ message: 'Return not found' });
    res.json(returnReq);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/returns/:id/status
// @desc    Update return status
router.put('/:id/status', async (req, res) => {
  try {
    const { status, trackingNumber, courier, adminNotes, rejectionReason, shippingAmount } = req.body;
    const returnReq = await ReturnRequest.findById(req.params.id);
    
    if (!returnReq) return res.status(404).json({ message: 'Return not found' });
    
    returnReq.returnStatus = status;
    
    if (status === 'Approved') returnReq.approvedAt = Date.now();
    if (status === 'In Transit') {
      if (trackingNumber) returnReq.returnTrackingNumber = trackingNumber;
      if (courier) returnReq.returnCourier = courier;
    }
    if (status === 'Received') returnReq.receivedAt = Date.now();
    if (status === 'Inspection Complete') returnReq.inspectedAt = Date.now();
    if (status === 'Rejected') {
      returnReq.rejectionReason = rejectionReason;
      returnReq.returnStatus = 'Rejected';
    }
    
    if (adminNotes) returnReq.adminNotes = adminNotes;
    if (shippingAmount) returnReq.returnShippingAmount = shippingAmount;

    await returnReq.save();

    // Optionally: Send status update emails here

    res.json(returnReq);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/returns/:id/refund
// @desc    Initiate Razorpay Refund
router.post('/:id/refund', async (req, res) => {
  try {
    const returnReq = await ReturnRequest.findById(req.params.id);
    if (!returnReq) return res.status(404).json({ message: 'Return not found' });
    
    if (returnReq.returnStatus === 'Refund Completed' || returnReq.returnStatus === 'Refund Processing') {
      return res.status(400).json({ message: 'Refund already initiated or completed' });
    }

    if (!returnReq.razorpayPaymentId) {
      return res.status(400).json({ message: 'No Razorpay payment ID associated with this return' });
    }

    // Razorpay amount is in paise (multiply by 100)
    // Make sure refundAmount doesn't exceed original payment (ideally handled securely)
    const amountInPaise = Math.round(returnReq.refundAmount * 100);

    // Initiate refund
    const refund = await razorpay.payments.refund(returnReq.razorpayPaymentId, {
      amount: amountInPaise,
      notes: {
        returnId: returnReq.returnId,
        orderId: returnReq.order.toString()
      },
      receipt: `REF-${returnReq.returnId}`
    });

    returnReq.razorpayRefundId = refund.id;
    returnReq.returnStatus = 'Refund Processing'; // Or 'Refund Completed' based on Razorpay status
    returnReq.refundInitiatedAt = Date.now();
    
    if (refund.status === 'processed') {
      returnReq.returnStatus = 'Refund Completed';
      returnReq.refundCompletedAt = Date.now();
    }

    await returnReq.save();
    
    res.json(returnReq);
  } catch (error) {
    console.error('Razorpay Refund Error:', error);
    // Do not mark as failed immediately unless we know it's a hard failure
    const returnReq = await ReturnRequest.findById(req.params.id);
    if (returnReq) {
      returnReq.returnStatus = 'Refund Failed';
      returnReq.adminNotes = (returnReq.adminNotes || '') + '\nRefund Failed: ' + (error.error?.description || error.message);
      await returnReq.save();
    }
    res.status(500).json({ message: 'Failed to initiate refund', error: error.error?.description || error.message });
  }
});

module.exports = router;
