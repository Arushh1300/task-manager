const Task = require('../models/Task');

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { title, description, assignedTo, projectId, dueDate } = req.body;

    if (!title || !description || !projectId || !dueDate) {
      res.status(400);
      throw new Error('Please add all required fields');
    }

    const task = await Task.create({
      title,
      description,
      assignedTo: assignedTo || req.user.id,
      projectId,
      dueDate,
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Get tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const { project, user } = req.query;
    let query = {};

    if (project) query.projectId = project;
    if (user) query.assignedTo = user;

    // If member, restricted to their own or project tasks they are in (simplified here)
    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('projectId', 'name');

    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    await task.deleteOne();

    res.status(200).json({ message: 'Task removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};
