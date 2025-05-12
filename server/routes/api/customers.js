// server/routes/api/customers.js
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Customer = require('../../models/Customer');
const Transaction = require('../../models/Transaction');

// @route   GET api/customers
// @desc    Get all customers
// @access  Public
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find().sort({ name: 1 });
    res.json(customers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/customers/:id
// @desc    Get customer by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    
    if (!customer) {
      return res.status(404).json({ msg: 'Customer not found' });
    }
    
    res.json(customer);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Customer not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/customers
// @desc    Create a customer
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('mobile', 'Mobile number is required').not().isEmpty(),
    check('address', 'Address is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, mobile, address, email } = req.body;

    try {
      const customer = new Customer({
        name,
        mobile,
        address,
        email
      });

      await customer.save();
      res.json(customer);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/customers/:id
// @desc    Update a customer
// @access  Public
router.put('/:id', async (req, res) => {
  const { name, mobile, address, email } = req.body;

  // Build customer object
  const customerFields = {};
  if (name) customerFields.name = name;
  if (mobile) customerFields.mobile = mobile;
  if (address) customerFields.address = address;
  if (email) customerFields.email = email;
  customerFields.updatedAt = Date.now();

  try {
    let customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ msg: 'Customer not found' });
    }

    customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { $set: customerFields },
      { new: true }
    );

    res.json(customer);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Customer not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/customers/:id
// @desc    Delete a customer
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ msg: 'Customer not found' });
    }

    // Check if customer has transactions
    const transactions = await Transaction.find({ customer: req.params.id });
    if (transactions.length > 0) {
      return res.status(400).json({ 
        msg: 'Cannot delete customer with existing transactions. Delete transactions first.' 
      });
    }

    await customer.deleteOne();
    res.json({ msg: 'Customer removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Customer not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET api/customers/:id/transactions
// @desc    Get all transactions for a customer
// @access  Public
router.get('/:id/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find({ customer: req.params.id })
      .populate('product', ['name', 'sku', 'price'])
      .sort({ date: -1 });
    
    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
