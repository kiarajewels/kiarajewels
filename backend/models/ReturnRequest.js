const mongoose = require('mongoose');

const returnRequestSchema = new mongoose.Schema(
  {
    returnId: { type: String, required: true, unique: true },
    order: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Order' },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    customerEmail: { type: String, required: true },
    customerName: { type: String, required: true },
    returnItems: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true }, // The discounted/actual price paid
      }
    ],
    reason: { type: String, required: true },
    comments: { type: String },
    evidence: [{ type: String }], // Array of Cloudinary URLs
    returnStatus: { 
      type: String, 
      required: true, 
      default: 'Requested',
      enum: ['Requested', 'Approved', 'Rejected', 'In Transit', 'Received', 'Inspection Complete', 'Refund Processing', 'Refund Completed', 'Refund Failed']
    },
    requestedAt: { type: Date, default: Date.now },
    approvedAt: { type: Date },
    receivedAt: { type: Date },
    inspectedAt: { type: Date },
    refundInitiatedAt: { type: Date },
    refundCompletedAt: { type: Date },
    refundAmount: { type: Number, default: 0 },
    razorpayPaymentId: { type: String },
    razorpayRefundId: { type: String },
    returnShippingAmount: { type: Number, default: 0 },
    returnCourier: { type: String },
    returnTrackingNumber: { type: String },
    adminNotes: { type: String },
    rejectionReason: { type: String },
  },
  { timestamps: true }
);

const ReturnRequest = mongoose.model('ReturnRequest', returnRequestSchema);
module.exports = ReturnRequest;
