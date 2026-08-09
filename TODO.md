# MERN Migration TODO

## Backend

- [ ] Create server/package.json
- [ ] Create server/config/db.js
- [ ] Create server/models/Student.js
- [ ] Create server/controllers/studentController.js
- [ ] Create server/routes/studentRoutes.js
- [ ] Create server/middleware/errorHandler.js
- [ ] Create server/middleware/notFound.js
- [ ] Create server/utils/migrateSQLite.js
- [ ] Create server/server.js
- [ ] Create server/.env.example
- [ ] npm install in server

## Frontend

- [ ] Create client/package.json
- [ ] Create client/vite.config.js
- [ ] Create client/index.html
- [ ] Copy Student-png.webp to client/public/
- [ ] Copy design system to client/src/index.css
- [ ] Create client/src/main.jsx
- [ ] Create client/src/App.jsx
- [ ] Create client/src/services/studentApi.js
- [ ] Create client/src/hooks/useStudents.js
- [ ] Create client/src/utils/validation.js
- [ ] Create components (Navbar, StatsCard, SearchBar, FilterBar, StudentTable, StudentCard, StudentModal, StudentForm, ConfirmDialog, Toast)
- [ ] Create pages/Dashboard.jsx
- [ ] Create client/.env.example
- [ ] npm install in client

## Root / Docs

- [ ] Create root package.json (concurrently)
- [ ] Update .gitignore
- [ ] Rewrite README.md

## Testing

- [ ] Verify backend starts
- [ ] Verify MongoDB connection
- [ ] Test CRUD endpoints
- [ ] Run SQLite migration
- [ ] Verify frontend build
