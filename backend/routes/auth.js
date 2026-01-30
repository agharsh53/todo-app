const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const User = require('../models/User');

// Initialize Firebase Admin
try {
  const serviceAccount = require('../firebase-admin.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('✅ Firebase Admin initialized from JSON file');
} catch (error) {
  console.log('⚠️  Could not load Firebase JSON file:', error.message);
  // For development, initialize with minimal config
  admin.initializeApp({
    projectId: 'dev-project'
  });
}

// Firebase authentication middleware
const verifyFirebaseToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    
    if (!token) {
      // For development/testing
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: Using mock user');
        req.user = { 
          uid: 'dev-user-' + Date.now(), 
          email: 'dev@example.com' 
        };
        return next();
      }
      return res.status(401).json({ error: 'No token provided' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    
    // For development, allow to continue
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode: Using mock user after error');
      req.user = { 
        uid: 'dev-user-' + Date.now(), 
        email: 'dev@example.com' 
      };
      return next();
    }
    
    res.status(401).json({ error: 'Invalid token' });
  }
};

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