import { useState } from "react";
import { DEPARTMENTS, YEARS, validateStudent } from "../utils/validation";

const EMPTY_FORM = {
  name: "",
  roll_no: "",
  department: "Computer Science",
  year: "1",
  email: "",
  phone: "",
  cgpa: "",
};

const StudentForm = ({
  initialData,
  onSubmit,
  onCancel,
  existingStudents = [],
}) => {
  const [form, setForm] = useState(() => {
    if (initialData) {
      return {
        name: initialData.name || "",
        roll_no: initialData.roll_no || "",
        department: initialData.department || "Computer Science",
        year: String(initialData.year || 1),
        email: initialData.email || "",
        phone: initialData.phone || "",
        cgpa: initialData.cgpa ? String(initialData.cgpa) : "",
      };
    }
    return EMPTY_FORM;
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear individual field error as user types
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateStudent(
      form,
      existingStudents,
      initialData?._id || null,
    );
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const payload = {
      name: form.name.trim(),
      roll_no: form.roll_no.trim().toUpperCase(),
      department: form.department,
      year: Number(form.year),
      email: form.email.trim(),
      phone: form.phone.trim(),
      cgpa: form.cgpa === "" ? 0 : Number(form.cgpa),
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-group full">
          <label className="form-label">Full Name *</label>
          <input
            type="text"
            className={`form-input ${errors.name ? "has-error" : ""}`}
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Aravind Kumar"
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Roll Number *</label>
          <input
            type="text"
            className={`form-input ${errors.roll_no ? "has-error" : ""}`}
            name="roll_no"
            value={form.roll_no}
            onChange={handleChange}
            placeholder="e.g. 21CS001"
          />
          {errors.roll_no && (
            <span className="field-error">{errors.roll_no}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Year *</label>
          <select
            className="form-input"
            name="year"
            value={form.year}
            onChange={handleChange}
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
                {y === 1 ? "st" : y === 2 ? "nd" : y === 3 ? "rd" : "th"} Year
              </option>
            ))}
          </select>
          {errors.year && <span className="field-error">{errors.year}</span>}
        </div>

        <div className="form-group full">
          <label className="form-label">Department *</label>
          <select
            className="form-input"
            name="department"
            value={form.department}
            onChange={handleChange}
          >
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          {errors.department && (
            <span className="field-error">{errors.department}</span>
          )}
        </div>

        <div className="form-group full">
          <label className="form-label">Email *</label>
          <input
            type="email"
            className={`form-input ${errors.email ? "has-error" : ""}`}
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="student@college.edu"
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Phone</label>
          <input
            type="text"
            className="form-input"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="10-digit number"
          />
          {errors.phone && <span className="field-error">{errors.phone}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">CGPA</label>
          <input
            type="number"
            className="form-input"
            name="cgpa"
            value={form.cgpa}
            onChange={handleChange}
            placeholder="e.g. 8.5"
            min="0"
            max="10"
            step="0.01"
          />
          {errors.cgpa && <span className="field-error">{errors.cgpa}</span>}
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Save Student
        </button>
      </div>
    </form>
  );
};

export default StudentForm;
