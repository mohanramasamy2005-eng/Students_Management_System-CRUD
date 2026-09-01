const mongoose = require("mongoose");
const Student = require("../models/Student");
const {
  getDuplicateDetail,
  buildDuplicateMessage,
} = require("../utils/duplicateCheck");

/**
 * @desc    Get all students (with optional search & department filter)
 * @route   GET /api/students
 * @access  Public
 */
const getStudents = async (req, res, next) => {
  try {
    const { search, department, sort } = req.query;

    const filter = {};
    if (department) {
      filter.department = department;
    }
    if (search) {
      const regex = new RegExp(
        search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i",
      );
      filter.$or = [{ name: regex }, { roll_no: regex }, { email: regex }];
    }

    // Default sort matches original app: newest created_at first
    let sortOption = { created_at: -1 };
    if (sort === "oldest") sortOption = { created_at: 1 };
    if (sort === "name") sortOption = { name: 1 };
    if (sort === "cgpa") sortOption = { cgpa: -1 };

    const students = await Student.find(filter).sort(sortOption);

    res
      .status(200)
      .json({ success: true, count: students.length, data: students });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single student by id
 * @route   GET /api/students/:id
 * @access  Public
 */
const getStudent = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid student ID format" });
    }

    const student = await Student.findById(id);
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    res.status(200).json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new student
 * @route   POST /api/students
 * @access  Public
 */
const createStudent = async (req, res, next) => {
  try {
    const { name, roll_no, department, year, email, phone, cgpa } = req.body;

    const existing = await Student.findOne({
      $or: [
        {
          roll_no: {
            $regex: `^${String(roll_no || "").trim()}$`,
            $options: "i",
          },
        },
        { email: { $regex: `^${String(email || "").trim()}$`, $options: "i" } },
        { phone: { $regex: `^${String(phone || "").trim()}$`, $options: "i" } },
      ],
    });

    if (existing) {
      const duplicate = getDuplicateDetail({ roll_no, email, phone }, existing);
      const message = buildDuplicateMessage(
        duplicate || {
          field: "detail",
          label: "Detail",
        },
      );

      return res.status(409).json({
        success: false,
        message,
      });
    }

    const student = await Student.create({
      name,
      roll_no,
      department,
      year,
      email,
      phone,
      cgpa,
    });

    res.status(201).json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing student
 * @route   PUT /api/students/:id
 * @access  Public
 */
const updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid student ID format" });
    }

    const student = await Student.findById(id);
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    const { name, roll_no, department, year, email, phone, cgpa } = req.body;

    const dup = await Student.findOne({
      _id: { $ne: id },
      $or: [
        {
          roll_no: {
            $regex: `^${String(roll_no || "").trim()}$`,
            $options: "i",
          },
        },
        { email: { $regex: `^${String(email || "").trim()}$`, $options: "i" } },
        { phone: { $regex: `^${String(phone || "").trim()}$`, $options: "i" } },
      ],
    });
    if (dup) {
      const duplicate = getDuplicateDetail({ roll_no, email, phone }, dup);
      const message = buildDuplicateMessage(
        duplicate || {
          field: "detail",
          label: "Detail",
        },
      );

      return res.status(409).json({
        success: false,
        message,
      });
    }

    student.name = name ?? student.name;
    student.roll_no = roll_no ?? student.roll_no;
    student.department = department ?? student.department;
    student.year = year ?? student.year;
    student.email = email ?? student.email;
    student.phone = phone ?? student.phone;
    student.cgpa = cgpa ?? student.cgpa;

    await student.save();

    res.status(200).json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a student
 * @route   DELETE /api/students/:id
 * @access  Public
 */
const deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid student ID format" });
    }

    const student = await Student.findById(id);
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    await student.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "Student deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
};
