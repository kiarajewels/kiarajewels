const express = require('express');
const User = require('../models/User');
const OTP = require('../models/OTP');
const nodemailer = require('nodemailer');
const router = express.Router();

// Setup Nodemailer transporter
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

// @route   POST /api/users/send-otp
// @desc    Generate and send OTP for passwordless login
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    // Generate a 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete any existing OTP for this email to prevent spam/confusion
    await OTP.deleteMany({ email });

    // Save the new OTP
    await OTP.create({ email, otp: otpCode });

    // In a development environment without credentials, log it so the user can test
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log(`\n======================================================`);
      console.log(`MOCK EMAIL SENT TO: ${email}`);
      console.log(`OTP CODE: ${otpCode}`);
      console.log(`======================================================\n`);
      return res.status(200).json({ message: 'OTP logged to server console (SMTP not configured)' });
    }

    // Send the email
    const mailOptions = {
      from: `"Kiara Jewels" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Login OTP - Kiara Jewels',
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <h2>Kiara Jewels</h2>
          <p>Your one-time password (OTP) for login is:</p>
          <h1 style="letter-spacing: 4px; color: #27302E;">${otpCode}</h1>
          <p>This code will expire in 5 minutes.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'OTP sent to email' });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// @route   POST /api/users/contact
// @desc    Send a contact us message
router.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, orderNumber, subject, message } = req.body;
    
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const mailOptions = {
      from: `"Kiara Jewels Website" <${process.env.EMAIL_USER}>`,
      to: 'kiarajewels.co@gmail.com', // Explicitly route to their support email
      replyTo: email, // If they hit reply, it goes to the customer
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; max-width: 600px;">
          <h2 style="color: #27302E; margin-bottom: 20px;">New Contact Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          ${orderNumber ? `<p><strong>Order Number:</strong> ${orderNumber}</p>` : ''}
          <p><strong>Subject:</strong> ${subject}</p>
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `
    };

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail(mailOptions);
    } else {
      // Dev mode fallback
      console.log(`\n=== MOCK CONTACT US EMAIL ===\nFrom: ${name} (${email})\nSubject: ${subject}\nMessage:\n${message}\n==============================\n`);
    }

    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error("Error sending contact email:", error);
    res.status(500).json({ message: 'Failed to send message. Please try again later.' });
  }
});

// @route   POST /api/users/verify-otp
// @desc    Verify OTP for login
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp, phoneNumber } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const record = await OTP.findOne({ email, otp });

    if (!record) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // OTP is valid! Delete it so it can't be used again
    await OTP.deleteOne({ _id: record._id });

    // Find user or create if they don't exist
    let user = await User.findOne({ email });
    if (!user) {
      // Create a basic user from the email address
      const name = email.split('@')[0];
      user = await User.create({ email, name, phoneNumber });
    } else if (phoneNumber) {
      // Always update phone number if provided during login
      user.phoneNumber = phoneNumber;
      await user.save();
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      phoneNumber: user.phoneNumber,
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: 'Server error verifying OTP' });
  }
});

// @route   POST /api/users/auth
// @desc    Auth user from Google (find or create)
router.post('/auth', async (req, res) => {
  try {
    const { email, name, image } = req.body;
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ email, name, image });
    } else {
      // Update name/image if changed
      user.name = name || user.name;
      user.image = image || user.image;
      await user.save();
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/users/:email/phone
// @desc    Update user phone number
router.put('/:email/phone', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const user = await User.findOneAndUpdate(
      { email: req.params.email }, 
      { phoneNumber }, 
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/users/:email/sync
// @desc    Sync cart and wishlist
router.put('/:email/sync', async (req, res) => {
  try {
    const { cart, wishlist } = req.body;
    let updateFields = {};
    if (cart) updateFields.cart = cart;
    if (wishlist) updateFields.wishlist = wishlist;
    
    const user = await User.findOneAndUpdate(
      { email: req.params.email },
      { $set: updateFields },
      { new: true }
    );
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/users/active-carts
// @desc    Get all users with active carts
router.get('/active-carts', async (req, res) => {
  try {
    const users = await User.find({ 'cart.0': { $exists: true } })
      .select('name email phoneNumber cart updatedAt')
      .sort({ updatedAt: -1 });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/users/:email/addresses
// @desc    Get user's saved addresses
router.get('/:email/addresses', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.addresses || []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/users/:email/addresses
// @desc    Add a new saved address
router.post('/:email/addresses', async (req, res) => {
  try {
    const { address } = req.body;
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Initialize if undefined
    if (!user.addresses) user.addresses = [];
    user.addresses.push(address);
    await user.save();
    
    res.json(user.addresses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   DELETE /api/users/:email/addresses/:id
// @desc    Delete a saved address
router.delete('/:email/addresses/:id', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.id);
    await user.save();
    
    res.json(user.addresses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});


// @route   GET /api/users
// @desc    Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/users/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phoneNumber
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/users/login
// @desc    Authenticate user & get token (or just user data for NextAuth)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && user.password && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        phoneNumber: user.phoneNumber,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
