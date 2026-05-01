# 🚀 Team Task Manager (TaskFlow)

A full-stack MERN application for managing team projects and tasks with secure authentication and role-based access control (RBAC).

---

## 🌐 Live Demo

* **Frontend:** https://task-manager-phi-amber-10.vercel.app/
* **Backend:** https://task-manager-production-8a76.up.railway.app/

---

## 🔐 Demo Credentials

### 👑 Admin

* Email: [admin@example.com](mailto:admin@example.com)
* Password: password123

### 👤 Member

* Email: [member@example.com](mailto:member@example.com)
* Password: password123

---

## 🧠 Features

### 🔐 Authentication

* JWT-based Login & Signup
* Secure password hashing (bcrypt)

### 👥 Role-Based Access Control (RBAC)

#### Admin

* Create/Delete Projects
* Create/Delete Tasks
* Assign tasks to users

#### Member

* View projects & assigned tasks
* Update only assigned task status

---

## 📊 Core Modules

* 📁 Project Management
* ✅ Task Management
* 📈 Dashboard (task statistics)
* 🔒 Protected Routes
* 🔗 API Integration with Axios

---

## ⚙️ Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)

---

## 🧪 How to Test (Step-by-Step)

1. Open the frontend link
2. Login as **Admin**

   * Create projects and tasks
3. Logout
4. Login as **Member**

   * Verify restricted access (no create/delete options)
5. Update task status as assigned user

---

## 🔗 API Information

* All backend endpoints are available under `/api`
* Example routes:

  * `/api/auth`
  * `/api/projects`
  * `/api/tasks`

---

## 💡 Backend Status

* The backend is an API service
* Visiting the root URL (`/`) shows a status message
* APIs are accessible via `/api` routes

---

## ❤️ Health Check

```bash
GET /api/health
```

Response:

```json
{
  "status": "ok",
  "message": "Server is healthy"
}
```

---

## ⚠️ Notes

* Backend deployed on Railway (as required)
* Frontend deployed on Vercel for optimized performance
* This is a functional MVP (prototype) with RBAC
* Production-level security improvements can be added in future iterations

---

## 📦 Local Setup

### Backend

```bash
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Environment Variables

Create `.env` file in backend:

```env
MONGO_URI=your_mongodb_connection_string  
JWT_SECRET=your_secret_key  
```

---

## 👨‍💻 Author

**Arush Dwivedi**

---

## ⭐ If you like this project, give it a star!
