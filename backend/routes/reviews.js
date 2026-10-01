const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');
// Assuming admin verification middleware exists
// const { protect, admin } = require('../middleware/authMiddleware');

// 1. PUBLIC: Add a review from the website
router.post('/', async (req, res) => {
  try {
    const { product, order, customerName, rating, title, body, photos } = req.body;
    
    // Ensure product exists
    const productExists = await Product.findById(product);
    if (!productExists) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const review = new Review({
      product,
      order: order || null,
      customerName,
      rating,
      title,
      body,
      photos: photos || [],
      source: 'website',
      status: 'pending', // all website reviews start pending
      verifiedPurchase: order ? true : false, // weak verification, could be improved
    });

    const createdReview = await review.save();
    res.status(201).json(createdReview);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 2. PUBLIC: Get APPROVED reviews for a product
router.get('/product/:id', async (req, res) => {
  try {
    const reviews = await Review.find({ 
      product: req.params.id, 
      status: 'approved' 
    }).sort({ createdAt: -1 });

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? reviews.reduce((acc, item) => item.rating + acc, 0) / totalReviews 
      : 0;

    res.json({
      reviews,
      averageRating: Number(averageRating.toFixed(1)),
      totalReviews
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 3. ADMIN: Get all reviews (filtered by status)
// TODO: add protect, admin middleware
router.get('/admin', async (req, res) => {
  try {
    const statusFilter = req.query.status ? { status: req.query.status } : {};
    const reviews = await Review.find(statusFilter)
      .populate('product', 'name _id')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 4. ADMIN: Update review status
// TODO: add protect, admin middleware
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.status = status;
    const updatedReview = await review.save();
    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 5. ADMIN: Add a review imported-with-consent
// TODO: add protect, admin middleware
router.post('/admin', async (req, res) => {
  try {
    const { product, customerName, rating, title, body, photos } = req.body;
    
    const review = new Review({
      product,
      customerName,
      rating,
      title,
      body,
      photos: photos || [],
      source: 'imported-with-consent',
      status: 'approved', // imported by admin, pre-approved
      verifiedPurchase: true, // assumes admin confirmed
    });

    const createdReview = await review.save();
    res.status(201).json(createdReview);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
