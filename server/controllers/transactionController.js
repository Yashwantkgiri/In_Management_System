// server/controllers/transactionController.js
const Transaction = require('../models/Transaction');

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Public
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Add a new transaction
// @route   POST /api/transactions
// @access  Public
const addTransaction = async (req, res) => {
  try {
    const { type, product, quantity, date } = req.body;
    const newTransaction = new Transaction({ type, product, quantity, date });
    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

module.exports = {
  getAllTransactions,
  addTransaction
};
