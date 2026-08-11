# Student Management System

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/express-%3E%3D4.18-blue)](https://expressjs.com/)
[![React](https://img.shields.io/badge/react-%3E%3D18.0-blue)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/mongodb-%3E%3D4.0-green)](https://www.mongodb.com/)

A full-stack MERN application for managing student records. The application provides a responsive React dashboard and a RESTful Express API for creating, viewing, updating, searching, filtering, and deleting student data stored in MongoDB Atlas.

## Live application

- Frontend: https://students-management-system-crud.vercel.app
- API: https://students-management-system-crud.onrender.com/api/students

## Features

- Create, view, update, and delete student records
- Search by name, roll number, or email
- Filter by department and sort by date, name, or CGPA
- Dashboard statistics for students, departments, and average CGPA
- Client-side and server-side validation
- Clear API error messages and browser-console diagnostics
- Responsive interface built with React and Vite

## Technology stack

| Layer | Technology |
| --- | --- |
| Frontend | React, Vite, Axios |
| Backend | Node.js, Express |
| Database | MongoDB Atlas, Mongoose |
| Frontend hosting | Vercel |
| Backend hosting | Render |

## Architecture

```text
React + Vite (Vercel)
        |
        | Axios: <VITE_API_URL>/students
        v
Express API (Render)
        |
        | Mongoose
        v
MongoDB Atlas
```

## Project structure

```text
Students_Management_System-CRUD/
+-- client/                         # React + Vite frontend
|   +-- src/
|   |   +-- components/              # Reusable UI components
|   |   +-- hooks/useStudents.js     # Student data and CRUD state
|   |   +-- pages/Dashboard.jsx      # Main dashboard
|   |   +-- services/studentApi.js   # Axios API client
|   +-- .env.example
|   +-- vite.config.js
+-- server/                         # Express + MongoDB backend
|   +-- config/db.js                 # MongoDB connection
|   +-- controllers/                 # Request handlers
|   +-- middleware/                  # Error and 404 handling
|   +-- models/                      # Mongoose schemas
|   +-- routes/                      # API routes
|   +-- server.js                    # Application entry point
|   +-- .env.example
+-- package.json
```

## Prerequisites

- Node.js 18 or later
- npm 9 or later
- A MongoDB Atlas database or local MongoDB instance

## Local development

### 1. Install dependencies

From the repository root:

```bash
npm run install:all
```

Alternatively, install dependencies separately in `client/` and `server/`.

### 2. Configure environment variables

Create `server/.env` from `server/.env.example`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/student_management
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Create `client/.env` from `client/.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
```

Never commit `.env` files or database credentials.

### 3. Start the application

Run both services from the repository root:

```bash
npm run dev
```

Or start them separately:

```bash
npm run dev:server
npm run dev:client
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Local API: http://localhost:5000/api/students

## API reference

Base URL: `/api/students`

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/students` | List students; supports search, department, and sort filters |
| GET | `/api/students/:id` | Get one student by MongoDB ID |
| POST | `/api/students` | Create a student |
| PUT | `/api/students/:id` | Update a student |
| DELETE | `/api/students/:id` | Delete a student |

### List query parameters

| Parameter | Values | Description |
| --- | --- | --- |
| `search` | text | Matches name, roll number, or email |
| `department` | department name | Filters by department |
| `sort` | `newest`, `oldest`, `name`, `cgpa` | Sort order |

### Example response

```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "...",
      "name": "Student Name",
      "roll_no": "21CS001",
      "department": "Computer Science",
      "year": 1,
      "email": "student@example.com",
      "phone": "",
      "cgpa": 8.5
    }
  ]
}
```

## Deployment

### Render backend

Create a **Web Service** for the `server/` directory. Do not deploy it as a Static Site.

| Setting | Value |
| --- | --- |
| Root Directory | `server` |
| Build Command | `npm install` |
| Start Command | `npm start` |

Set these environment variables in Render:

```env
MONGODB_URI=<your MongoDB Atlas connection string>
CLIENT_URL=https://students-management-system-crud.vercel.app
NODE_ENV=production
```

Render supplies `PORT` automatically. The server listens on `process.env.PORT || 5000`.

### Vercel frontend

Deploy the `client/` directory as the Vercel project root. Set the following Production environment variable before deploying:

```env
VITE_API_URL=https://students-management-system-crud.onrender.com/api
```

Vite embeds `VITE_*` variables during the build, so redeploy the frontend after changing `VITE_API_URL`.

The frontend sends requests to:

```text
https://students-management-system-crud.onrender.com/api/students
```

## Error diagnostics

When an API request fails, the UI displays a useful HTTP or network error. The browser console logs the request URL, HTTP status, response data, and Axios error message to help diagnose deployment or CORS issues without exposing credentials.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run install:all` | Install client and server dependencies |
| `npm run dev` | Run frontend and backend together |
| `npm run dev:client` | Run the Vite development server |
| `npm run dev:server` | Run the Express development server |
| `npm run build` | Build the frontend for production |
| `npm run start` | Start the backend from the root project script |
| `npm run migrate` | Migrate legacy SQLite records to MongoDB |

## License

This project is available under the MIT License.
