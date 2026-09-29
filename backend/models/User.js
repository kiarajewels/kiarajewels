const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for OAuth users
    isAdmin: { type: Boolean, required: true, default: false },
    image: { type: String },
    phoneNumber: { type: String, default: '' },
    cart: [{ id: String, quantity: Number }],
    wishlist: [String],
    addresses: [{
      firstName: String,
      lastName: String,
      mobile: String,
      house: String,
      floor: String,
      area: String,
      landmark: String,
      city: String,
      state: String,
      pincode: String,
      type: { type: String, default: 'Home' }
    }]
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
module.exports = User;
