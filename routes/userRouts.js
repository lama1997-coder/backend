const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({status:0, message: 'User already exists' });
    }

    const user = new User({ email, password });
    await user.save();

    res.status(201).json({status:1, message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({status:0, message: 'User not found' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

   return res.json({status:1,message: 'Login Sucsess' , token });
  } catch (error) {

    res.status(500).json({ message: error });
  }
});

module.exports = router;
