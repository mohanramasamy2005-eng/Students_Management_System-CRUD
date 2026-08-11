const dns = require("dns");

// Use public DNS servers so MongoDB Atlas SRV records resolve correctly
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config({
  path: path.join(__dirname, ".env"),
});

const connectDB = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// CORS configuration
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root API route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Student Management System API",
    endpoints: {
      get_all: "GET /api/students",
      get_one: "GET /api/students/:id",
      create: "POST /api/students",
      update: "PUT /api/students/:id",
      delete: "DELETE /api/students/:id",
    },
  });
});

// Student routes
app.use("/api/students", studentRoutes);

// 404 handler
app.use(notFound);

// Centralized error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start server only after successful DB connection
const start = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

start();
