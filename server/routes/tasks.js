import express from 'express';
import { body, validationResult } from 'express-validator';
import Task from '../models/Task.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error('Không lấy được dữ liệu:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi' });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) {
      return res.status(404).json({ message: 'Không tìm thấy công việc nào' });
    }

    res.json(task);
  } catch (error) {
    console.error('Không lấy được dữ liệu:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi' });
  }
});

router.post(
  '/',
  authenticate,
  [
    body('title').notEmpty().withMessage('Vui lòng nhập tiêu đề'),
    body('dueDate').notEmpty().withMessage('Cần phải có ngày đến hạn')
  ],
  async (req, res) => {
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
      console.error('Không lấy được dữ liệu:', error);
      res.status(500).json({ message: 'Đã xảy ra lỗi' });
    }
  }
);

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
        return res.status(404).json({ message: 'Không tìm thấy công việc nào' });
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
      console.error('Đã xảy ra lỗi khi cập nhật công việc', error);
      res.status(500).json({ message: 'Đã xảy ra lỗi' });
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
      return res.status(404).json({ message: 'Không tìm thấy công việc nào' });
    }

    await task.deleteOne();
    res.json({ message: 'Đã xóa công việc thành công' });
  } catch (error) {
    console.error('Đã xảy ra lỗi khi xóa công việc', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi' });
  }
});

export default router;