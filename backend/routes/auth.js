const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');

const JWT_SECRET = process.env.JWT_SECRET || "finance_secret_key_123";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// ─── SIGNUP ────────────────────────────────────────────────────────────────
router.post('/signup', async (req, res) => {
  console.log("🔥 SIGNUP HIT");
  try {
    const name     = (req.body.name     || "").trim();
    const email    = (req.body.email    || "").trim().toLowerCase();
    const password = (req.body.password || "").trim();

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return res.status(400).json({ message: "Invalid email format" });

    if (password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      message: "Signup successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar }
    });

  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    if (err.code === 11000)
      return res.status(400).json({ message: "User already exists" });
    res.status(500).json({ message: "Server error" });
  }
});

// ─── LOGIN ─────────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  console.log("🔥 LOGIN HIT");
  try {
    const email    = (req.body.email    || "").trim().toLowerCase();
    const password = (req.body.password || "").trim();

    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    // Google-only user trying to login with password
    if (!user.password)
      return res.status(400).json({ message: "Please use Google to sign in" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar }
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ─── GOOGLE AUTH ───────────────────────────────────────────────────────────
router.post('/google', async (req, res) => {
  console.log("🔥 GOOGLE AUTH HIT");
  try {
    const { credential } = req.body;
    if (!credential)
      return res.status(400).json({ message: "Google credential missing" });

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Find or create user
    let user = await User.findOne({ email });

    if (user) {
      // Update googleId if not set
      if (!user.googleId) {
        user.googleId = googleId;
        user.avatar   = picture;
        await user.save();
      }
    } else {
      // Create new user (no password for Google users)
      user = new User({ name, email, googleId, avatar: picture });
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      message: "Google login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar }
    });

  } catch (err) {
    console.error("GOOGLE AUTH ERROR:", err);
    res.status(500).json({ message: "Google authentication failed" });
  }
});

// ─── GOOGLE TOKEN (access token flow) ─────────────────────────────────────
router.post('/google-token', async (req, res) => {
  console.log("🔥 GOOGLE TOKEN HIT");
  try {
    const { email, name, googleId, avatar } = req.body;
    if (!email || !name) return res.status(400).json({ message: "Invalid Google data" });

    let user = await User.findOne({ email });
    if (user) {
      if (!user.googleId) { user.googleId = googleId; user.avatar = avatar; await user.save(); }
    } else {
      user = new User({ name, email, googleId, avatar });
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      message: "Google login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar }
    });
  } catch (err) {
    console.error("GOOGLE TOKEN ERROR:", err);
    if (err.code === 11000) return res.status(400).json({ message: "Account already exists" });
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

