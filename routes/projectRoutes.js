const express = require('express');
const router = express.Router();
const { createProject, getProjects, deleteProject } = require('../controllers/projectController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getProjects)
  .post(protect, adminOnly, createProject);

router.route('/:id')
  .delete(protect, adminOnly, deleteProject);

module.exports = router;
