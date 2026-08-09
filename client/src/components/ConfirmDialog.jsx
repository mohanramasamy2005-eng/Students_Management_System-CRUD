const ConfirmDialog = ({ open, student, onCancel, onConfirm }) => {
  if (!open) return null;

  return (
    <div className="overlay active" onClick={onCancel}>
      <div
        className="modal confirm-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="icon">🗑️</div>
        <h3>Delete Student?</h3>
        <p>
          This will permanently remove{' '}
          <strong>{student ? student.name : ''}</strong> from the database. This
          action cannot be undone.
        </p>
        <div className="confirm-actions">
          <button className="btn btn-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
