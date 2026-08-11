# Student Management System

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/express-%3E%3D4.18-blue)](https://expressjs.com/)
[![React](https://img.shields.io/badge/react-%3E%3D18.0-blue)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/mongodb-%3E%3D4.0-green)](https://www.mongodb.com/)

A production-ready full-stack **MERN** (MongoDB, Express, React, Node.js) Student Record Management System with complete CRUD functionality. This application was modernized from a legacy HTML/CSS/JS + SQLite single-page application to a scalable, enterprise-grade MERN architecture while preserving the original UI design, core functionality, and visual identity.

## Overview

This project is a modernized version of the original Student Management CRUD app. The original single-page application (HTML/CSS/JS + SQLite) has been fully migrated into a production-quality MERN architecture while preserving the original UI design, functionality, and visual identity.

## Features

- **Dashboard Statistics:** Total Students, Departments, and Average CGPA.
- **Search:** Instantly filter students by name, roll number, or email.
- **Filter:** Filter by department.
- **Sort:** Sort by newest/oldest, name, or highest CGPA.
- **Add Students:** Modal form with full validation.
- **Edit Students:** Pre-filled modal form to update records.
- **Delete Students:** Confirmation dialog before permanent removal.
- **Form Validation:** On both frontend and backend.
- **Toast Notifications:** Success and error feedback.
- **Loading / Empty / Error States:** Clear UI feedback for all states.
- **Responsive UI:** Dark-mode inspired design with department and CGPA color-coding.
- **REST API:** Structured Express backend with centralized error handling.

## Technology Stack

**Frontend:**
- React (18)
- Vite
- Axios
- Custom CSS Design System (variables, DM Sans + Space Mono fonts)

**Backend:**
- Node.js
- Express
- Mongoose

**Database:**
- MongoDB

## Project Architecture

```
React (client)
   ↓  Axios (HTTP requests)
Express (server/routes)
   ↓  Controllers (business logic)
Mongoose (models)
   ↓
MongoDB
```

## Folder Structure

```
Students_Management_System-CRUD/
│
├── client/                 # React + Vite frontend
│   ├── public/
│   │   └── Student-png.webp
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Dashboard page
│   │   ├── services/       # studentApi.js (all API calls)
│   │   ├── hooks/          # useStudents.js
│   │   ├── utils/          # validation.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Node.js + Express backend
│   ├── config/
│   │   └── db.js           # MongoDB connection
│   ├── models/
│   │   └── Student.js      # Mongoose schema
│   ├── controllers/
│   │   └── studentController.js
│   ├── routes/
│   │   └── studentRoutes.js
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   └── notFound.js
│   ├── utils/
│   │   └── migrateSQLite.js # SQLite → MongoDB migration
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── students.db           # Legacy SQLite database file
├── index.html            # Legacy frontend HTML (original single-page app)
├── script.js             # Legacy frontend JS (original single-page app)
├── style.css             # Legacy frontend CSS (original single-page app)
├── package.json            # Root (concurrently dev script)
├── README.md
└── .gitignore
```

## Prerequisites

- **Node.js** (v18 or later)
- **npm** (v9 or later)
- **MongoDB** — a running local instance, or a MongoDB Atlas connection string

## Installation

### 1. Open the project

```bash
cd Students_Management_System-CRUD
```

### 2. Install client dependencies

```bash
cd client
npm install
```

### 3. Install server dependencies

```bash
cd server
npm install
```

### 4. Configure MongoDB

Make sure MongoDB is running locally (default: `mongodb://127.0.0.1:27017`). Alternatively, use a MongoDB Atlas URI.

### 5. Configure environment variables

Create a `.env` file in the `server` folder (copy from `.env.example`):

```bash
cp server/.env.example server/.env
```

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/student_management
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Create a `.env` file in the `client` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

### 6. Run migration (optional, to import existing SQLite data)

From the project root:
```bash
npm run migrate
```

Or from the server directory:
```bash
cd server
npm run migrate
```

This reads the original `students.db` file and inserts the records into MongoDB (avoiding duplicates).

### 7. Start the backend

```bash
cd server
npm run dev
```

The server runs on `http://localhost:5000`.

### 8. Start the frontend

```bash
cd client
npm run dev
```

The frontend runs on `http://localhost:5173`.

> **Tip:** From the project root, you can install all dependencies and run both servers simultaneously with:
> ```bash
> npm run install:all
> npm run dev
> ```
> Or run them separately:
> ```bash
> # Terminal 1
> npm run dev:server
> 
> # Terminal 2
> npm run dev:client
> ```

## API Endpoints

| Method | Endpoint              | Description                    | Status Codes                     |
|--------|-----------------------|--------------------------------|----------------------------------|
| GET    | `/api/students`       | Get all students (with search, department & sort query params) | 200 |
| GET    | `/api/students/:id`   | Get a single student by ID     | 200, 400, 404                    |
| POST   | `/api/students`       | Create a new student           | 201, 400, 409                    |
| PUT    | `/api/students/:id`   | Update an existing student     | 200, 400, 404, 409               |
| DELETE | `/api/students/:id`   | Delete a student               | 200, 400, 404                    |

**Query parameters for `GET /api/students`:**
- `search` — match by name, roll_no, or email (case-insensitive)
- `department` — filter by exact department
- `sort` — `newest` (default), `oldest`, `name`, `cgpa`

**Response format:**
```json
{
  "success": true,
  "data": [...]
}
```

**Error format:**
```json
{
  "success": false,
  "message": "Student not found"
}
```

## Database

MongoDB collection: `students` (in the `student_management` database by default).

**Mongoose schema (mirrors the original SQLite schema):**

| Field        | Type     | Constraints                                |
|--------------|----------|--------------------------------------------|
| `_id`        | ObjectId | (MongoDB primary key)                      |
| `legacyId`   | Number   | Original SQLite integer id (for traceability) |
| `name`       | String   | required, trimmed                          |
| `roll_no`    | String   | required, unique, uppercase, trimmed       |
| `department` | String   | required, enum (6 departments)             |
| `year`       | Number   | required, 1–4                              |
| `email`      | String   | required, unique, lowercase, valid format  |
| `phone`      | String   | optional, trimmed                          |
| `cgpa`       | Number   | 0–10                                       |
| `created_at` | Date     | auto (timestamps)                          |
| `updated_at` | Date     | auto (timestamps)                          |

## SQLite Migration

The original application stored data in a SQLite database (`students.db`). To migrate that data into MongoDB:

From the project root:
```bash
npm run migrate
```

Or from the server directory:
```bash
cd server
npm run migrate
```

How it works:
1. Reads the `students.db` file using `sql.js`.
2. Reads all student records.
3. Transforms them into the Mongoose schema (preserving the original integer id in `legacyId`).
4. Connects to MongoDB.
5. Inserts records, **skipping duplicates** (by roll_no or email).
6. Reports how many records were inserted/skipped.

The migration is **non-destructive** — it never deletes existing MongoDB data, and SQLite is not used at runtime by the application.

## Future Improvements

- Add server-side pagination for large datasets
- Add authentication and role-based access control
- Add CSV/Excel export/import of student records
- Add interactive chart visualizations for student statistics
- Improve accessibility (ARIA labels, keyboard navigation)
- Add end-to-end testing suite and CI/CD pipeline
- Add support for multiple academic years/semesters
- Implement bulk student import/export functionality

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an Issue for any bugs, feature requests, or improvements.

## Support

If you encounter any issues or need help with the application, please open an issue on the GitHub repository.

---

*Maintained by Mohan Ramasamy*
