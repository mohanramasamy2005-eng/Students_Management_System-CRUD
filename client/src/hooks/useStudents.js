import { useState, useEffect, useCallback } from 'react';
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from '../services/studentApi';

/**
 * Custom hook managing all student data, loading and error state.
 * Centralizes all CRUD operations for the frontend.
 */
const useStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [sort, setSort] = useState('newest');

  // Fetch students from the API
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (department) params.department = department;
      if (sort) params.sort = sort;

      const data = await getStudents(params);
      setStudents(data.data || []);
    } catch (err) {
      const message =
        err.response?.data?.message || 'Failed to load students. Is the server running?';
      setError(message);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, [search, department, sort]);

  // Load on mount and whenever search/filter/sort changes
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const addStudent = async (student) => {
    const data = await createStudent(student);
    await fetchStudents();
    return data.data;
  };

  const editStudent = async (id, student) => {
    const data = await updateStudent(id, student);
    await fetchStudents();
    return data.data;
  };

  const removeStudent = async (id) => {
    const data = await deleteStudent(id);
    await fetchStudents();
    return data;
  };

  return {
    students,
    loading,
    error,
    search,
    setSearch,
    department,
    setDepartment,
    sort,
    setSort,
    fetchStudents,
    addStudent,
    editStudent,
    removeStudent,
  };
};

export default useStudents;
