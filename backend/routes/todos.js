const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const User = require('../models/User');
const admin = require('firebase-admin');

const verifyFirebaseToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    
    if (!token) {
      // For development
      if (process.env.NODE_ENV === 'development') {
        req.firebaseUID = 'dev-user-' + Date.now();
        return next();
      }
      return res.status(401).json({ error: 'No token provided' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.firebaseUID = decodedToken.uid;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    
    // For development
    if (process.env.NODE_ENV === 'development') {
      req.firebaseUID = 'dev-user-' + Date.now();
      return next();
    }
    
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get todos for a board
router.get('/board/:boardId', verifyFirebaseToken, async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUID: req.firebaseUID });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const todos = await Todo.find({
      boardId: req.params.boardId,
      userId: user._id
    }).sort({ createdAt: -1 });

    res.json(todos);
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// Create todo
router.post('/', verifyFirebaseToken, async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUID: req.firebaseUID });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { title, description, status, priority, dueDate, boardId } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Todo title is required' });
    }
    
    if (!boardId) {
      return res.status(400).json({ error: 'Board ID is required' });
    }

    const todo = new Todo({
      title: title.trim(),
      description: description?.trim() || '',
      status: status || 'todo',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      boardId,
      userId: user._id
    });

    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// Update todo
router.put('/:id', verifyFirebaseToken, async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUID: req.firebaseUID });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { title, description, status, priority, dueDate } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Todo title is required' });
    }

    const todo = await Todo.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: user._id
      },
      {
        title: title.trim(),
        description: description?.trim() || '',
        status: status || 'todo',
        priority: priority || 'medium',
        dueDate: dueDate || null,
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(todo);
  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// Delete todo
router.delete('/:id', verifyFirebaseToken, async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUID: req.firebaseUID });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      userId: user._id
    });

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

// Update todo status
router.patch('/:id/status', verifyFirebaseToken, async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUID: req.firebaseUID });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { status } = req.body;

    if (!['todo', 'in-progress', 'done'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const todo = await Todo.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: user._id
      },
      {
        status,
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(todo);
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

module.exports = router;