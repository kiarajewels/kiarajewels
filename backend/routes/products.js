const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// @route   GET /api/products
// @desc    Get all products (with optional category filter)
router.get('/', async (req, res) => {
  try {
    const category = req.query.category;
    const isGifting = req.query.isGifting;
    const isBestSeller = req.query.isBestSeller;
    let filter = {};
    if (category && category.toLowerCase() !== 'all') {
      filter.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }
    if (isGifting === 'true') {
      filter.isGifting = true;
    }
    if (isBestSeller === 'true') {
      filter.isBestSeller = true;
    }
    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/products
// @desc    Create a new product (Admin)
router.post('/', async (req, res) => {
  try {
    const { name, media, description, category, price, originalPrice, countInStock } = req.body;
    
    // In a full app, we would verify the user is an admin here
    
    const product = new Product({
      name,
      media,
      description,
      category,
      price,
      originalPrice,
      countInStock,
    });
    
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/products/:id/stock
// @desc    Update product stock (Admin)
router.put('/:id/stock', async (req, res) => {
  try {
    const { countInStock } = req.body;
    const product = await Product.findById(req.params.id);
    
    if (product) {
      product.countInStock = countInStock;
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/products/:id
// @desc    Get a single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product (Admin)
router.put('/:id', async (req, res) => {
  try {
    const { name, media, description, category, price, originalPrice, countInStock, isGifting, isBestSeller } = req.body;
    const product = await Product.findById(req.params.id);
    
    if (product) {
      product.name = name || product.name;
      product.media = media || product.media;
      product.description = description || product.description;
      product.category = category || product.category;
      product.price = price !== undefined ? price : product.price;
      product.originalPrice = originalPrice !== undefined ? originalPrice : product.originalPrice;
      product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;
      product.isGifting = isGifting !== undefined ? isGifting : product.isGifting;
      product.isBestSeller = isBestSeller !== undefined ? isBestSeller : product.isBestSeller;
      
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
