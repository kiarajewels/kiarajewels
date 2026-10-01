const express = require('express');
const router = express.Router();
const CustomOrder = require('../models/CustomOrder');

// GET all custom orders (for admin)
router.get('/', async (req, res) => {
  try {
    const orders = await CustomOrder.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new custom order (from frontend)
router.post('/', async (req, res) => {
  try {
    const newOrder = new CustomOrder({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      description: req.body.description,
      referenceImage: req.body.referenceImage
    });
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE a custom order (for admin to change status)
router.put('/:id', async (req, res) => {
  try {
    const updatedOrder = await CustomOrder.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
