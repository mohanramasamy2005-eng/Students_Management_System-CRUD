/**
 * Frontend validation helpers.
 * Mirrors the backend validation rules.
 */

export const DEPARTMENTS = [
  "Computer Science",
  "Electronics",
  "Mechanical",
  "Civil",
  "Information Technology",
  "Electrical",
];

export const YEARS = [1, 2, 3, 4];

const normalizeDuplicateValue = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

const normalizePhoneForDuplicateCheck = (value) =>
  String(value ?? "")
    .replace(/[^\d]/g, "")
    .trim();

export const getDuplicateError = (
  values,
  students = [],
  currentStudentId = null,
) => {
  const checks = [
    {
      key: "roll_no",
      label: "Roll Number",
      message:
        "This roll number is already in use. Please enter a different roll number.",
      normalize: (value) => normalizeDuplicateValue(value),
    },
    {
      key: "email",
      label: "Email",
      message: "This email is already in use. Please enter a different email.",
      normalize: (value) => normalizeDuplicateValue(value),
    },
    {
      key: "phone",
      label: "Phone",
      message:
        "This phone number is already in use. Please enter a different phone number.",
      normalize: (value) => normalizePhoneForDuplicateCheck(value),
    },
  ];

  for (const check of checks) {
    const incoming = check.normalize(values[check.key]);
    if (!incoming) continue;

    const duplicateStudent = students.find((student) => {
      if (currentStudentId && student._id === currentStudentId) return false;
      const candidate = check.normalize(student[check.key]);
      return candidate && candidate === incoming;
    });

    if (duplicateStudent) {
      return {
        field: check.key,
        message: check.message,
      };
    }
  }

  return null;
};

export const validateStudent = (
  values,
  students = [],
  currentStudentId = null,
) => {
  const errors = {};

  // name
  if (!values.name || !values.name.trim()) {
    errors.name = "Full name is required";
  } else if (values.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  // roll_no
  if (!values.roll_no || !values.roll_no.trim()) {
    errors.roll_no = "Roll number is required";
  } else if (values.roll_no.trim().length < 3) {
    errors.roll_no = "Roll number must be at least 3 characters";
  }

  // department
  if (!values.department) {
    errors.department = "Department is required";
  }

  // year
  const year = Number(values.year);
  if (!values.year || Number.isNaN(year) || year < 1 || year > 4) {
    errors.year = "Year must be between 1 and 4";
  }

  // email
  if (!values.email || !values.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Please provide a valid email address";
  }

  // phone (optional but must be valid if present)
  if (
    values.phone &&
    values.phone.trim() &&
    !/^[0-9+()\-\s]{0,20}$/.test(values.phone.trim())
  ) {
    errors.phone = "Please provide a valid phone number";
  }

  // cgpa (optional but must be in range)
  if (values.cgpa !== "" && values.cgpa !== null && values.cgpa !== undefined) {
    const cgpa = Number(values.cgpa);
    if (Number.isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
      errors.cgpa = "CGPA must be between 0 and 10";
    }
  }

  const duplicateError = getDuplicateError(values, students, currentStudentId);
  if (duplicateError) {
    errors[duplicateError.field] = duplicateError.message;
  }

  return errors;
};

export const getDeptClass = (dept) => {
  const map = {
    "Computer Science": "dept-cs",
    "Information Technology": "dept-cs",
    Electronics: "dept-ec",
    Electrical: "dept-ec",
    Mechanical: "dept-me",
    Civil: "dept-ce",
  };
  return map[dept] || "dept-other";
};

export const getCgpaClass = (cgpa) => {
  const val = Number(cgpa) || 0;
  if (val >= 8.5) return "cgpa-high";
  if (val >= 6.5) return "cgpa-mid";
  return "cgpa-low";
};

export const getInitials = (name) => {
  return String(name || "")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};
