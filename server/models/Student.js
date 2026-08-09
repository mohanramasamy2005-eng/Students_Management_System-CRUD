const mongoose = require("mongoose");

/**
 * Student Mongoose schema.
 * Mirrors the original SQLite `students` table schema:
 *   id, name, roll_no, department, year, email, phone, cgpa, created_at
 *
 * MongoDB's `_id` is used as the primary key; the original integer `id`
 * from SQLite is preserved in `legacyId` for compatibility/traceability.
 */
const studentSchema = new mongoose.Schema(
  {
    legacyId: {
      type: Number,
      default: null,
    },
    name: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name must be at most 100 characters"],
    },
    roll_no: {
      type: String,
      required: [true, "Roll number is required"],
      unique: true,
      trim: true,
      uppercase: true,
      minlength: [3, "Roll number must be at least 3 characters"],
      maxlength: [30, "Roll number must be at most 30 characters"],
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
      enum: [
        "Computer Science",
        "Electronics",
        "Mechanical",
        "Civil",
        "Information Technology",
        "Electrical",
      ],
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
      min: [1, "Year must be between 1 and 4"],
      max: [4, "Year must be between 1 and 4"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },
    phone: {
      type: String,
      trim: true,
      default: "",
      match: [/^[0-9+()\-\s]{0,20}$/, "Please provide a valid phone number"],
    },
    cgpa: {
      type: Number,
      default: 0,
      min: [0, "CGPA must be between 0 and 10"],
      max: [10, "CGPA must be between 0 and 10"],
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
);

module.exports = mongoose.model("Student", studentSchema);
