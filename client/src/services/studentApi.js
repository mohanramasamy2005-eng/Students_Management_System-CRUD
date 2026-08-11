import axios from "axios";

// API URL
// Local: http://localhost:5000/api
// Render: VITE_API_URL environment variable
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Get all students
 */
export const getStudents = async (params = {}) => {
  const { data } = await api.get("/students", { params });
  return data;
};

/**
 * Get a single student
 */
export const getStudent = async (id) => {
  const { data } = await api.get(`/students/${id}`);
  return data;
};

/**
 * Create a new student
 */
export const createStudent = async (student) => {
  const { data } = await api.post("/students", student);
  return data;
};

/**
 * Update a student
 */
export const updateStudent = async (id, student) => {
  const { data } = await api.put(`/students/${id}`, student);
  return data;
};

/**
 * Delete a student
 */
export const deleteStudent = async (id) => {
  const { data } = await api.delete(`/students/${id}`);
  return data;
};

export default api;