const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
      },
    ],
    shippingAddress: {
      firstName: { type: String, required: true },
      lastName: { type: String },
      mobile: { type: String, required: true },
      email: { type: String },
      house: { type: String, required: true },
      floor: { type: String },
      area: { type: String, required: true },
      landmark: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      type: { type: String, default: 'Home' }
    },
    paymentMethod: { type: String, required: true },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    taxPrice: { type: Number, required: true, default: 0.0 },
    shippingPrice: { type: Number, required: true, default: 0.0 },
    totalPrice: { type: Number, required: true, default: 0.0 },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: { type: Date },
    status: { type: String, required: true, default: 'Pending' }, // Pending, Processing, In-Transit, Delivered
  },
  { timestamps: true }
);

// Inventory subtraction hook
orderSchema.post('save', async function (doc, next) {
  // Only decrease stock if the order was just marked as paid
  if (doc.isPaid && doc.isModified('isPaid')) {
    const Product = mongoose.model('Product');
    
    for (const item of doc.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { countInStock: -item.qty }
      });
    }
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
