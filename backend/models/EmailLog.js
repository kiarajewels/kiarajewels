const mongoose = require('mongoose');

const emailLogSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    customerEmail: { type: String, required: true },
    emailType: { 
      type: String, 
      required: true,
      enum: ['ORDER_CONFIRMATION', 'ORDER_PROCESSING', 'ORDER_IN_TRANSIT', 'ORDER_DELIVERED', 'REVIEW_REQUEST']
    },
    status: { type: String, required: true, enum: ['SENT', 'FAILED'] },
    providerMessageId: { type: String },
    error: { type: String },
    sentAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Prevent duplicate emails of the same type for the same order (if sent successfully)
// We might not use a strict unique index in case we want to allow retries, 
// but we will manually check before sending.
// Let's add an index for quick lookup
emailLogSchema.index({ order: 1, emailType: 1 });

const EmailLog = mongoose.model('EmailLog', emailLogSchema);
module.exports = EmailLog;
