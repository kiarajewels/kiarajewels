const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    media: [
      {
        url: { type: String, required: true },
        type: { type: String, enum: ['image', 'video'], required: true },
      }
    ],
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    originalPrice: { type: Number, required: false, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    isGifting: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
