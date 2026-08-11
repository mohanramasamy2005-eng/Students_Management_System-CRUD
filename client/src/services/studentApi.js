import axios from 'axios';

const normalizeApiUrl = (url) => {
  const baseUrl = (url || 'http://localhost:5000').trim().replace(/\/+$/, '');
  return baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
};

// Vite substitutes VITE_* variables at build time. Set VITE_API_URL in Vercel
// before building to the Render service URL (for example, https://<service>.onrender.com).
export const API_URL = normalizeApiUrl(import.meta.env.VITE_API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getStudents = async (params = {}) => {
  const { data } = await api.get('/students', { params });
  return data;
};

export const getStudent = async (id) => {
  const { data } = await api.get(`/students/${id}`);
  return data;
};

export const createStudent = async (student) => {
  const { data } = await api.post('/students', student);
  return data;
};

export const updateStudent = async (id, student) => {
  const { data } = await api.put(`/students/${id}`, student);
  return data;
};

export const deleteStudent = async (id) => {
  const { data } = await api.delete(`/students/${id}`);
  return data;
};

export const getApiErrorMessage = (error) => {
  if (error.response) {
    const message =
      error.response.data?.message || error.response.statusText || 'Request failed';
    return `API request failed (HTTP ${error.response.status}): ${message}`;
  }

  if (error.request) {
    return `Unable to reach the API at ${API_URL}. Check the deployed API URL and CORS settings.`;
  }

  return error.message || 'An unexpected API error occurred.';
};

export default api;
