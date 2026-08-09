const mongoose = require("mongoose");
const Student = require("../models/Student");

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

    // Explicit duplicate check for clearer 409 message
    const existing = await Student.findOne({
      $or: [{ roll_no }, { email }],
    });
    if (existing) {
      const field = existing.roll_no === roll_no ? "roll number" : "email";
      return res.status(409).json({
        success: false,
        message: `A student with that ${field} already exists`,
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

    // Duplicate check excluding self
    const dup = await Student.findOne({
      $or: [{ roll_no }, { email }],
      _id: { $ne: id },
    });
    if (dup) {
      const field = dup.roll_no === roll_no ? "roll number" : "email";
      return res.status(409).json({
        success: false,
        message: `A student with that ${field} already exists`,
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
