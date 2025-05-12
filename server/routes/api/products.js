// server/routes/api/products.js
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Product = require('../../models/Product');

/**
 * @route   GET api/products
 * @desc    Get all products
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ name: 1 });
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   GET api/products/:id
 * @desc    Get product by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    
    res.json(product);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Product not found' });
    }
    
    res.status(500).send('Server Error');
  }
});

/**
 * @route   POST api/products
 * @desc    Create a product
 * @access  Private
 */
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('sku', 'SKU is required').not().isEmpty(),
    check('category', 'Category is required').not().isEmpty(),
    check('price', 'Price must be a positive number').isFloat({ min: 0 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Check if SKU already exists
      const existingProduct = await Product.findOne({ sku: req.body.sku });
      if (existingProduct) {
        return res.status(400).json({ msg: 'A product with this SKU already exists' });
      }

      const newProduct = new Product(req.body);
      const product = await newProduct.save();
      
      res.json(product);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

/**
 * @route   PUT api/products/:id
 * @desc    Update a product
 * @access  Private
 */
router.put(
  '/:id',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('category', 'Category is required').not().isEmpty(),
    check('price', 'Price must be a positive number').isFloat({ min: 0 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const product = await Product.findById(req.params.id);
      
      if (!product) {
        return res.status(404).json({ msg: 'Product not found' });
      }
      
      // Update fields
      const productFields = { ...req.body };
      delete productFields.sku; // Prevent SKU modification
      
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        { $set: productFields },
        { new: true }
      );
      
      res.json(updatedProduct);
    } catch (err) {
      console.error(err.message);
      
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Product not found' });
      }
      
      res.status(500).send('Server Error');
    }
  }
);

/**
 * @route   DELETE api/products/:id
 * @desc    Delete a product
 * @access  Private
 */
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    
    await product.remove();
    
    res.json({ msg: 'Product removed' });
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Product not found' });
    }
    
    res.status(500).send('Server Error');
  }
});

/**
 * @route   GET api/products/category/:category
 * @desc    Get products by category
 * @access  Public
 */
router.get('/category/:category', async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category }).sort({ name: 1 });
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   GET api/products/low-stock
 * @desc    Get products with low stock
 * @access  Public
 */
router.get('/low-stock', async (req, res) => {
  try {
    const products = await Product.find({
      $expr: { $lte: ["$quantity", "$reorderLevel"] }
    }).sort({ quantity: 1 });
    
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;