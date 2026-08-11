import { useState } from "react";
import useStudents from "../hooks/useStudents";
import Navbar from "../components/Navbar";
import StatsCard from "../components/StatsCard";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import StudentTable from "../components/StudentTable";
import StudentModal from "../components/StudentModal";
import ConfirmDialog from "../components/ConfirmDialog";
import Toast from "../components/Toast";
import { getApiErrorMessage, logApiError } from "../services/studentApi";

const icons = {
  total: {
    color: "#4dff91",
    path: (
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
  },
  depts: {
    color: "#4da6ff",
    path: (
      <>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9,22 9,12 15,12 15,22" />
      </>
    ),
  },
  cgpa: {
    color: "#ffb84d",
    path: (
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    ),
  },
};

const Dashboard = () => {
  const {
    students,
    loading,
    error,
    search,
    setSearch,
    department,
    setDepartment,
    sort,
    setSort,
    addStudent,
    editStudent,
    removeStudent,
  } = useStudents();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const openAddModal = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEditModal = (student) => {
    setEditing(student);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const handleSubmit = async (payload) => {
    try {
      if (editing) {
        await editStudent(editing._id, payload);
        showToast("Student updated successfully", "success");
      } else {
        await addStudent(payload);
        showToast("Student added successfully", "success");
      }
      closeModal();
    } catch (err) {
      logApiError("save student", err);
      const message = getApiErrorMessage(err);
      showToast(message, "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await removeStudent(deleteTarget._id);
      showToast("Student deleted successfully", "success");
      setDeleteTarget(null);
    } catch (err) {
      logApiError("delete student", err);
      const message = getApiErrorMessage(err);
      showToast(message, "error");
      setDeleteTarget(null);
    }
  };

  // Compute statistics
  const totalStudents = students.length;
  const totalDepts = new Set(students.map((s) => s.department)).size;
  const avgCgpa =
    students.length > 0
      ? students.reduce((acc, s) => acc + (Number(s.cgpa) || 0), 0) /
        students.length
      : 0;

  return (
    <>
      <Navbar onAddStudent={openAddModal} />

      <div className="container">
        <div className="stats-row">
          <StatsCard
            label="Total Students"
            value={loading ? "—" : totalStudents}
            icon={icons.total}
            color="green"
          />
          <StatsCard
            label="Departments"
            value={loading ? "—" : totalDepts}
            icon={icons.depts}
            color="blue"
          />
          <StatsCard
            label="Avg CGPA"
            value={loading ? "—" : avgCgpa > 0 ? avgCgpa.toFixed(2) : "—"}
            icon={icons.cgpa}
            color="yellow"
          />
        </div>

        {error && <div className="error-banner">{error}</div>}

        <div className="toolbar">
          <SearchBar value={search} onChange={setSearch} />
          <FilterBar
            department={department}
            onDepartmentChange={setDepartment}
            sort={sort}
            onSortChange={setSort}
          />
        </div>

        <StudentTable
          students={students}
          loading={loading}
          onEdit={openEditModal}
          onDelete={setDeleteTarget}
        />
      </div>

      <StudentModal
        open={modalOpen}
        editing={editing}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        student={deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />

      <div className="toast-container">
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} type={t.type} />
        ))}
      </div>
    </>
  );
};

export default Dashboard;
