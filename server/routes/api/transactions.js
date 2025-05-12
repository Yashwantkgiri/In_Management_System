// server/routes/api/transactions.js
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Transaction = require('../../models/Transaction');
const Product = require('../../models/Product');
const Customer = require('../../models/Customer');

// @route   GET api/transactions
// @desc    Get recent transactions (limited to 50)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('product', ['name', 'sku'])
      .populate('customer', ['name', 'mobile'])
      .sort({ date: -1 })
      .limit(50);
    
    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/transactions/:id
// @desc    Get transaction by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('product', ['name', 'sku', 'price'])
      .populate('customer', ['name', 'mobile']);
    
    if (!transaction) {
      return res.status(404).json({ msg: 'Transaction not found' });
    }
    
    res.json(transaction);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Transaction not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/transactions
// @desc    Create a transaction (stock in/out)
// @access  Public
router.post(
  '/',
  [
    check('type', 'Type is required (in or out)').isIn(['in', 'out']),
    check('product', 'Product ID is required').not().isEmpty(),
    check('customer', 'Customer ID is required').not().isEmpty(),
    check('quantity', 'Quantity is required and must be a number').isNumeric(),
    check('price', 'Price is required and must be a number').isNumeric(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { type, product: productId, customer: customerId, quantity, price, notes } = req.body;

    try {
      // Verify product exists
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ msg: 'Product not found' });
      }
      
      // Verify customer exists
      const customer = await Customer.findById(customerId);
      if (!customer) {
        return res.status(404).json({ msg: 'Customer not found' });
      }
      
      // For stock-out, check if sufficient quantity is available
      if (type === 'out' && product.stock < quantity) {
        return res.status(400).json({ 
          msg: `Insufficient stock. Available: ${product.stock}, Requested: ${quantity}` 
        });
      }
      
      // Calculate total amount
      const totalAmount = price * quantity;
      
      // Create transaction
      const transaction = new Transaction({
        type,
        product: productId,
        customer: customerId,
        quantity,
        price,
        totalAmount,
        notes
      });
      
      // Update product stock
      if (type === 'in') {
        product.stock += Number(quantity);
      } else {
        product.stock -= Number(quantity);
      }
      
      await product.save();
      await transaction.save();
      
      // Return transaction with populated fields
      const populatedTransaction = await Transaction.findById(transaction._id)
        .populate('product', ['name', 'sku'])
        .populate('customer', ['name', 'mobile']);
      
      res.json(populatedTransaction);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/transactions/:id
// @desc    Delete a transaction and update product stock
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ msg: 'Transaction not found' });
    }
    
    // Update product stock to reverse the transaction
    const product = await Product.findById(transaction.product);
    if (product) {
      if (transaction.type === 'in') {
        product.stock -= transaction.quantity;
      } else {
        product.stock += transaction.quantity;
      }
      await product.save();
    }

    await transaction.deleteOne();
    res.json({ msg: 'Transaction removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Transaction not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET api/transactions/report/summary
// @desc    Get transaction summary report
// @access  Public
router.get('/report/summary', async (req, res) => {
  try {
    // Get total stock-in value
    const stockInTotal = await Transaction.aggregate([
      { $match: { type: 'in' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    // Get total stock-out value
    const stockOutTotal = await Transaction.aggregate([
      { $match: { type: 'out' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    // Get transactions by category
    const categoryTransactions = await Transaction.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: 'product',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      { $unwind: '$productDetails' },
      {
        $group: {
          _id: {
            type: '$type',
            category: '$productDetails.category'
          },
          totalAmount: { $sum: '$totalAmount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.category': 1, '_id.type': 1 } }
    ]);
    
    res.json({
      stockInTotal: stockInTotal.length > 0 ? stockInTotal[0].total : 0,
      stockOutTotal: stockOutTotal.length > 0 ? stockOutTotal[0].total : 0,
      categoryTransactions
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/transactions/report/value
// @desc    Get total inventory value
// @access  Public
router.get('/report/value', async (req, res) => {
  try {
    const inventoryValue = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalValue: { $sum: { $multiply: ['$price', '$stock'] } },
          totalProducts: { $sum: 1 },
          totalItems: { $sum: '$stock' }
        }
      }
    ]);
    
    res.json(inventoryValue.length > 0 ? inventoryValue[0] : {
      totalValue: 0,
      totalProducts: 0,
      totalItems: 0
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;