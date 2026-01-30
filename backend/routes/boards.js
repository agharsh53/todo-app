const express = require('express');
const router = express.Router();
const Board = require('../models/Board');
const User = require('../models/User');
const { verifyFirebaseToken } = require('../config/firebase.config');

// Get all boards for user
router.get('/', verifyFirebaseToken, async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUID: req.user.uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const boards = await Board.find({ userId: user._id }).sort({ createdAt: -1 });
    res.json(boards);
  } catch (error) {
    console.error('Get boards error:', error);
    res.status(500).json({ error: 'Failed to fetch boards' });
  }
});

// Get single board
router.get('/:id', verifyFirebaseToken, async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUID: req.user.uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const board = await Board.findOne({
      _id: req.params.id,
      userId: user._id
    });

    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    res.json(board);
  } catch (error) {
    console.error('Get board error:', error);
    res.status(500).json({ error: 'Failed to fetch board' });
  }
});

// Create board
router.post('/', verifyFirebaseToken, async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUID: req.user.uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { title, description, color } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Board title is required' });
    }

    const board = new Board({
      title: title.trim(),
      description: description?.trim() || '',
      color: color || '#6366f1',
      userId: user._id
    });

    await board.save();
    res.status(201).json(board);
  } catch (error) {
    console.error('Create board error:', error);
    res.status(500).json({ error: 'Failed to create board' });
  }
});

// Update board
router.put('/:id', verifyFirebaseToken, async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUID: req.user.uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { title, description, color } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Board title is required' });
    }

    const board = await Board.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: user._id
      },
      {
        title: title.trim(),
        description: description?.trim() || '',
        color: color || '#6366f1',
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    res.json(board);
  } catch (error) {
    console.error('Update board error:', error);
    res.status(500).json({ error: 'Failed to update board' });
  }
});

// Delete board
router.delete('/:id', verifyFirebaseToken, async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUID: req.user.uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const board = await Board.findOneAndDelete({
      _id: req.params.id,
      userId: user._id
    });

    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    res.json({ message: 'Board deleted successfully' });
  } catch (error) {
    console.error('Delete board error:', error);
    res.status(500).json({ error: 'Failed to delete board' });
  }
});

module.exports = router;