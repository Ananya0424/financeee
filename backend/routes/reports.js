const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Transaction = require("../models/Transaction");

// 📊 Generate Monthly CSV Report
router.post("/generate", authMiddleware, async (req, res) => {
  try {
    const { month, year } = req.body;
    const userId = req.user.id;

    // 📌 Get transactions from MongoDB
    const transactions = await Transaction.find({
      userId,
      date: {
        $gte: new Date(year, month - 1, 1),
        $lte: new Date(year, month, 0, 23, 59, 59)
      }
    }).sort({ date: -1 });

    if (transactions.length === 0) {
      return res.status(404).json({ message: "No transactions found for this month." });
    }

    // Generate CSV String
    let csv = "Date,Title,Category,Payment Method,Type,Amount (INR)\n";
    transactions.forEach(t => {
      const dateStr = new Date(t.date).toLocaleDateString("en-IN");
      const typeStr = t.type === "income" ? "Income" : "Expense";
      // Handle commas in titles or notes by wrapping in quotes
      const cleanTitle = `"${t.title.replace(/"/g, '""')}"`;
      csv += `${dateStr},${cleanTitle},${t.category},${t.paymentMethod},${typeStr},${t.amount}\n`;
    });

    res.header("Content-Type", "text/csv");
    res.attachment(`Finance_Report_${month}_${year}.csv`);
    return res.send(csv);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;