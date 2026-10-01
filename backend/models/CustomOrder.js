const mongoose = require('mongoose');

const customOrderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  description: { type: String, required: true },
  referenceImage: { type: String },
  status: { type: String, enum: ['Pending', 'Quoted', 'Accepted', 'Completed', 'Rejected'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CustomOrder', customOrderSchema);
