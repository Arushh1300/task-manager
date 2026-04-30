const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');

dotenv.config();

const demoUser = {
  name: 'Demo Admin',
  email: 'demo@example.com',
  password: 'password123',
  role: 'admin',
};

const addDays = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

const seed = async () => {
  try {
    await connectDB();

    const existingDemoUser = await User.findOne({ email: demoUser.email });

    if (existingDemoUser) {
      const demoProjects = await Project.find({ createdBy: existingDemoUser._id }).select('_id');
      await Task.deleteMany({ projectId: { $in: demoProjects.map((project) => project._id) } });
      await Project.deleteMany({ createdBy: existingDemoUser._id });
      await User.deleteOne({ _id: existingDemoUser._id });
    }

    const user = await User.create(demoUser);

    const projects = await Project.insertMany([
      {
        name: 'Website Launch',
        description: 'Coordinate final design, content, and QA tasks for the public launch.',
        members: [user._id],
        createdBy: user._id,
      },
      {
        name: 'Product Ops',
        description: 'Track recurring product operations, analytics, and customer follow-ups.',
        members: [user._id],
        createdBy: user._id,
      },
    ]);

    await Task.insertMany([
      {
        title: 'Finalize landing page copy',
        description: 'Tighten the hero copy and review CTA language.',
        status: 'done',
        assignedTo: user._id,
        projectId: projects[0]._id,
        dueDate: addDays(-2),
      },
      {
        title: 'Run responsive QA',
        description: 'Check mobile and desktop layouts before demo.',
        status: 'in-progress',
        assignedTo: user._id,
        projectId: projects[0]._id,
        dueDate: addDays(2),
      },
      {
        title: 'Prepare launch checklist',
        description: 'Confirm analytics, redirects, and production env values.',
        status: 'todo',
        assignedTo: user._id,
        projectId: projects[0]._id,
        dueDate: addDays(5),
      },
      {
        title: 'Review overdue customer tasks',
        description: 'Prioritize overdue follow-ups for this week.',
        status: 'todo',
        assignedTo: user._id,
        projectId: projects[1]._id,
        dueDate: addDays(-1),
      },
      {
        title: 'Publish weekly dashboard',
        description: 'Share team progress metrics with stakeholders.',
        status: 'in-progress',
        assignedTo: user._id,
        projectId: projects[1]._id,
        dueDate: addDays(1),
      },
    ]);

    console.log('Demo data seeded successfully.');
    console.log('Login with demo@example.com / password123');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seed();
