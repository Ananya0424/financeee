const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const verifyToken = require('../middleware/authMiddleware');

// Add transaction
router.post('/add', verifyToken, async (req, res) => {
  try {
    const { title, amount, type, category, paymentMethod, notes } = req.body;
    const transaction = new Transaction({
      userId: req.user.id,
      title,
      amount,
      type,
      category,
      paymentMethod,
      notes
    });
    await transaction.save();
    res.status(201).json({ message: "Transaction added!", transaction });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get all transactions
router.get('/all', verifyToken, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id })
      .sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete transaction
router.delete('/delete/:id', verifyToken, async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Transaction deleted!" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Edit transaction
router.put('/edit/:id', verifyToken, async (req, res) => {
  try {
    const { title, amount, type, category, paymentMethod, notes } = req.body;
    const updated = await Transaction.findByIdAndUpdate(
      req.params.id,
      { title, amount, type, category, paymentMethod, notes },
      { new: true }
    );
    res.status(200).json({ message: "Transaction updated!", transaction: updated });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;