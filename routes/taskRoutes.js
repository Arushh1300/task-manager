const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getTasks)
  .post(protect, adminOnly, createTask);

router.route('/:id')
  .put(protect, updateTask)
  .delete(protect, adminOnly, deleteTask);

module.exports = router;
