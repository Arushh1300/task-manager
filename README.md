# Team Task Manager Backend

A production-ready Node.js/Express/MongoDB backend for a Team Task Management application.

## Tech Stack
- **Node.js** & **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** for Authentication
- **Bcrypt.js** for Password Hashing
- **Helmet** & **CORS** for Security
- **Morgan** for Logging

## Folder Structure
```
├── config/             # Database configuration
├── controllers/        # Business logic for routes
├── middleware/         # Auth and Error handling middleware
├── models/             # Mongoose schemas
├── routes/             # API route definitions
├── .env                # Environment variables
├── server.js           # Entry point
└── package.json        # Dependencies and scripts
```

## Setup & Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure Environment Variables:
   Create a `.env` file in the root directory (already created for you) and update the values:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   ```

3. Run the server:
   - Development mode: `npm run dev`
   - Production mode: `npm start`

## API Endpoints

### Auth
- `POST /api/auth/signup`: Register a new user
- `POST /api/auth/login`: Authenticate user and get token

### Projects
- `POST /api/projects`: Create a new project (Admin only)
- `GET /api/projects`: Get projects relevant to the user

### Tasks
- `POST /api/tasks`: Create a new task (Admin only)
- `GET /api/tasks`: Get tasks (Filter by project/user via query params)
- `PUT /api/tasks/:id`: Update task status or assignment
- `DELETE /api/tasks/:id`: Delete a task (Admin only)

## Deployment (Railway)
This project is configured for deployment on Railway. Simply connect your GitHub repository, and it will automatically detect the `npm start` script.
