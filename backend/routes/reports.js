const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const authMiddleware = require("../middleware/authMiddleware");
const Transaction = require("../models/Transaction");

// 📌 SQLite DB create/connect
const db = new sqlite3.Database("./reports.db");

// 📌 Create table if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT,
    month INTEGER,
    year INTEGER,
    totalIncome REAL,
    totalExpense REAL,
    balance REAL
  )
`);

// 📊 Generate Monthly Report
router.post("/generate", authMiddleware, async (req, res) => {
  try {
    const { month, year } = req.body;
    const userId = req.user.id;

    // 📌 Get transactions from MongoDB
    const transactions = await Transaction.find({
      userId,
      date: {
        $gte: new Date(year, month - 1, 1),
        $lte: new Date(year, month, 0)
      }
    });

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(t => {
      if (t.type === "income") totalIncome += t.amount;
      else totalExpense += t.amount;
    });

    const balance = totalIncome - totalExpense;

    // 📌 Insert into SQLite
    db.run(
      `INSERT INTO reports (userId, month, year, totalIncome, totalExpense, balance)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, month, year, totalIncome, totalExpense, balance],
      function (err) {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "DB error" });
        }

        res.json({
          message: "Report saved successfully",
          reportId: this.lastID,
          totalIncome,
          totalExpense,
          balance
        });
      }
    );

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;