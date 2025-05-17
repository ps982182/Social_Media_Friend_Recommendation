// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User is already registered. Please login or use another email.' });
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Save user
    const user = new User({ name, email, password: hash });
    await user.save();

    res.json({ message: 'User registered successfully. Please login!' });
  } catch (err) {
    // Handle duplicate key error (in case of race condition)
    if (err.code === 11000) {
      return res.status(400).json({ message: 'User is already registered. Please login or use another email.' });
    }
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Both email and password are required.' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'No user found with this email.' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password.' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, 'SECRET_KEY', { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        profilePic: user.profilePic,
        email: user.email,
      },
      message: 'Login successful!',
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

module.exports = router;
