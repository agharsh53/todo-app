const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyFirebaseToken } = require('../config/firebase.config');

// Register/Login user with Firebase
router.post('/register', verifyFirebaseToken, async (req, res) => {
  try {
    const { email, name } = req.body;
    const firebaseUID = req.user.uid;

    // Check if user already exists
    let user = await User.findOne({ firebaseUID });

    if (!user) {
      user = new User({
        email: email || req.user.email || 'user@example.com',
        name: name || req.user.name || email?.split('@')[0] || 'User',
        firebaseUID
      });
      await user.save();
    }

    res.json({
      message: 'Authentication successful',
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed: ' + error.message });
  }
});

// Get current user
router.get('/me', verifyFirebaseToken, async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUID: req.user.uid });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user._id,
      email: user.email,
      name: user.name
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

module.exports = router;