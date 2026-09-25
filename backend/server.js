require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactions');
const reportRoutes = require("./routes/reports");

const app = express();

// enable cors for frontend
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use("/api/reports", reportRoutes);

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("DB connected successfully"))
  .catch(err => {
    console.log("DB connection failed!");
    console.log(err);
  });

app.get('/', (req, res) => {
  res.json({ message: "Server is running fine" });
});

// app.get('/test', (req, res) => {
//     res.send("test route working");
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server started on port ${PORT}`);
});