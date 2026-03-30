const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Create DB file
const db = new sqlite3.Database(
  path.join(__dirname, "reports.db"),
  (err) => {
    if (err) console.error(err.message);
    else console.log("✅ SQLite Connected");
  }
);

// Create Table
db.run(`
  CREATE TABLE IF NOT EXISTS monthly_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    month TEXT,
    year TEXT,
    totalIncome REAL,
    totalExpense REAL,
    balance REAL,
    topCategory TEXT
  )
`);

module.exports = db;