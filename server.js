const dotenv = require('dotenv');

// Load env vars before importing app dependencies that may read process.env.
dotenv.config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const maskMongoUri = (uri) => {
  if (!uri) return 'MONGO_URI is not set';

  return uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
};

const startServer = async () => {
  try {
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Mongo URI: ${maskMongoUri(process.env.MONGO_URI)}`);

    await connectDB();

    // Body parser
    app.use(express.json());

    // Enable CORS
    app.use(cors({
      origin: CLIENT_URL,
      credentials: true,
    }));

    // Set security headers
    app.use(helmet());

    // Dev logging middleware
    if (process.env.NODE_ENV === 'development') {
      app.use(morgan('dev'));
    }

    // Routes
    app.use('/api/auth', require('./routes/authRoutes'));
    app.use('/api/projects', require('./routes/projectRoutes'));
    app.use('/api/tasks', require('./routes/taskRoutes'));

    // Error handler
    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server startup failed because MongoDB could not connect.');
    console.error('Check MONGO_URI, MongoDB auth credentials, network access, and IP whitelist settings.');
    process.exit(1);
  }
};

startServer();
