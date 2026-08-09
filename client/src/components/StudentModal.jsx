import StudentForm from "./StudentForm";

const ModalCloseIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const StudentModal = ({ open, editing, onClose, onSubmit }) => {
  if (!open) return null;

  return (
    <div className="overlay active" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">
          <span>{editing ? "Edit Student" : "Add Student"}</span>
          <button className="modal-close" onClick={onClose}>
            <ModalCloseIcon />
          </button>
        </div>
        <StudentForm
          initialData={editing}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </div>
    </div>
  );
};

export default StudentModal;
