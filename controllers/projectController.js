const Project = require('../models/Project');

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res, next) => {
  try {
    const { name, description, members } = req.body;

    if (!name || !description) {
      res.status(400);
      throw new Error('Please add all fields');
    }

    const project = await Project.create({
      name,
      description,
      members: Array.from(new Set([req.user.id, ...(members || [])])),
      createdBy: req.user.id,
    });

    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's projects
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res, next) => {
  try {
    console.log("User:", req.user);
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    // Admins can see all, members see where they are members or creator
    let projects;
    if (req.user.role === 'admin') {
      projects = await Project.find().populate('members', 'name email');
    } else {
      projects = await Project.find({
        $or: [
          { createdBy: req.user.id },
          { members: req.user.id }
        ]
      }).populate('members', 'name email');
    }

    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    await project.deleteOne();

    res.status(200).json({ message: 'Project removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getProjects,
  deleteProject,
};
