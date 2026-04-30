const express = require('express');
const router = express.Router();
const { createProject, getProjects } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getProjects)
  .post(protect, createProject);

module.exports = router;
