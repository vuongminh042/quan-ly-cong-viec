import express from 'express';
import { body, validationResult } from 'express-validator';
import Task from '../models/Task.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all tasks for current user
router.get('/', authenticate, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single task by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new task
router.post(
  '/',
  authenticate,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('dueDate').notEmpty().withMessage('Due date is required')
  ],
  async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, description, status, priority, dueDate, project, labels } = req.body;
      
      const task = new Task({
        title,
        description,
        status,
        priority,
        dueDate,
        project,
        labels,
        user: req.user._id
      });
      
      await task.save();
      res.status(201).json(task);
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update a task
router.put(
  '/:id',
  authenticate,
  async (req, res) => {
    try {
      const task = await Task.findOne({ 
        _id: req.params.id,
        user: req.user._id
      });
      
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      
      const { title, description, status, priority, dueDate, project, labels } = req.body;
      
      // Update only provided fields
      if (title) task.title = title;
      if (description !== undefined) task.description = description;
      if (status) task.status = status;
      if (priority) task.priority = priority;
      if (dueDate) task.dueDate = dueDate;
      if (project !== undefined) task.project = project || null;
      if (labels) task.labels = labels;
      
      await task.save();
      res.json(task);
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Delete a task
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    await task.deleteOne();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;