import express from 'express';
import { body, validationResult } from 'express-validator';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all projects for current user
router.get('/', authenticate, async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single project by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const project = await Project.findOne({ 
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new project
router.post(
  '/',
  authenticate,
  [
    body('name').notEmpty().withMessage('Project name is required')
  ],
  async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, description, color } = req.body;
      
      const project = new Project({
        name,
        description,
        color,
        user: req.user._id
      });
      
      await project.save();
      res.status(201).json(project);
    } catch (error) {
      console.error('Error creating project:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update a project
router.put(
  '/:id',
  authenticate,
  async (req, res) => {
    try {
      const project = await Project.findOne({ 
        _id: req.params.id,
        user: req.user._id
      });
      
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      
      const { name, description, color } = req.body;
      
      // Update only provided fields
      if (name) project.name = name;
      if (description !== undefined) project.description = description;
      if (color) project.color = color;
      
      await project.save();
      res.json(project);
    } catch (error) {
      console.error('Error updating project:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Delete a project
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const project = await Project.findOne({ 
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Remove project from all tasks that reference it
    await Task.updateMany(
      { project: project._id },
      { $unset: { project: "" } }
    );
    
    await project.deleteOne();
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all tasks for a specific project
router.get('/:id/tasks', authenticate, async (req, res) => {
  try {
    const project = await Project.findOne({ 
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    const tasks = await Task.find({ 
      project: project._id,
      user: req.user._id
    }).sort({ createdAt: -1 });
    
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching project tasks:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;