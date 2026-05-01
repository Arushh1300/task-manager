const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');

// Load environment variables
dotenv.config();

const seed = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    
    // 6. Delete existing users, projects, and tasks
    await Task.deleteMany({});
    await Project.deleteMany({});
    await User.deleteMany({});
    
    // 2. Create Users
    // Admin
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });
    console.log('Admin created');

    // Member
    const memberUser = await User.create({
      name: 'Member User',
      email: 'member@example.com',
      password: 'password123',
      role: 'member'
    });
    console.log('Member created');

    // 4. Create Demo Projects
    const projects = await Project.create([
      {
        name: 'Website Redesign',
        description: 'Complete overhaul of the corporate website focusing on user experience.',
        createdBy: adminUser._id,
        members: [adminUser._id, memberUser._id]
      },
      {
        name: 'Mobile App',
        description: 'Development of the new iOS and Android mobile application.',
        createdBy: adminUser._id,
        members: [adminUser._id, memberUser._id]
      },
      {
        name: 'Marketing Campaign',
        description: 'Q3 digital marketing initiatives and content creation.',
        createdBy: adminUser._id,
        members: [adminUser._id, memberUser._id]
      }
    ]);
    console.log('Projects seeded');

    // Helper for generating dates
    const addDays = (days) => {
      const d = new Date();
      d.setDate(d.getDate() + days);
      return d;
    };

    // 5. Create tasks for each project
    // Note: The Task schema enum expects 'todo', 'in-progress', 'done'. 
    // Using 'todo' for pending and 'done' for completed to avoid validation errors.
    await Task.create([
      // Website Redesign Tasks
      {
        title: 'Design Mockups',
        description: 'Create Figma designs for the homepage and about page.',
        projectId: projects[0]._id,
        assignedTo: memberUser._id,
        dueDate: addDays(-2), // Past due date
        status: 'done'
      },
      {
        title: 'Frontend Implementation',
        description: 'Convert mockups to responsive React components.',
        projectId: projects[0]._id,
        assignedTo: memberUser._id,
        dueDate: addDays(5), // Future due date
        status: 'todo'
      },
      // Mobile App Tasks
      {
        title: 'API Integration',
        description: 'Connect mobile app with backend REST services.',
        projectId: projects[1]._id,
        assignedTo: memberUser._id,
        dueDate: addDays(10),
        status: 'in-progress'
      },
      {
        title: 'App Store Submission',
        description: 'Prepare assets and metadata for App Store review.',
        projectId: projects[1]._id,
        assignedTo: memberUser._id,
        dueDate: addDays(20),
        status: 'todo'
      },
      // Marketing Campaign Tasks
      {
        title: 'Social Media Assets',
        description: 'Design banners for Facebook, Twitter, and LinkedIn.',
        projectId: projects[2]._id,
        assignedTo: memberUser._id,
        dueDate: addDays(-5), // Past due date
        status: 'done'
      },
      {
        title: 'Launch Email Campaign',
        description: 'Send out the weekly newsletter to the subscriber list.',
        projectId: projects[2]._id,
        assignedTo: memberUser._id,
        dueDate: addDays(2),
        status: 'todo'
      }
    ]);
    console.log('Tasks seeded');

    // 8. Final output
    console.log('Demo database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seed();
