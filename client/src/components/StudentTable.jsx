import StudentCard from "./StudentCard";

const LoadingRow = () => (
  <tr>
    <td colSpan="8">
      <div className="loading">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    </td>
  </tr>
);

const EmptyRow = () => (
  <tr>
    <td colSpan="8">
      <div className="empty-state">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <p>No students found</p>
      </div>
    </td>
  </tr>
);

const StudentTable = ({ students, loading, onEdit, onDelete }) => {
  let content;
  if (loading) {
    content = <LoadingRow />;
  } else if (students.length === 0) {
    content = <EmptyRow />;
  } else {
    content = students.map((student, i) => (
      <StudentCard
        key={student._id}
        student={student}
        index={i}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    ));
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Student</th>
            <th>Roll No</th>
            <th>Department</th>
            <th>Year</th>
            <th>CGPA</th>
            <th>Contact</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{content}</tbody>
      </table>
    </div>
  );
};

export default StudentTable;
