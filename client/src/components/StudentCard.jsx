import { getDeptClass, getCgpaClass, getInitials } from "../utils/validation";

const StudentCard = ({ student, index, onEdit, onDelete }) => {
  return (
    <tr>
      <td
        style={{
          color: "var(--muted)",
          fontFamily: "var(--mono)",
          fontSize: "12px",
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </td>
      <td>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "rgba(200,241,53,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "11px",
              fontWeight: 600,
              color: "var(--accent)",
              flexShrink: 0,
            }}
          >
            {getInitials(student.name)}
          </div>
          <div>
            <div style={{ fontWeight: 500, fontSize: "13px" }}>
              {student.name}
            </div>
            <div style={{ fontSize: "11px", color: "var(--muted)" }}>
              {student.email}
            </div>
          </div>
        </div>
      </td>
      <td>
        <span className="roll-badge">{student.roll_no}</span>
      </td>
      <td>
        <span className={`dept-badge ${getDeptClass(student.department)}`}>
          {student.department}
        </span>
      </td>
      <td>
        <span className="year-dot">{student.year}</span>
      </td>
      <td>
        <span className={`cgpa-val ${getCgpaClass(student.cgpa)}`}>
          {student.cgpa ? Number(student.cgpa).toFixed(1) : "—"}
        </span>
      </td>
      <td style={{ color: "var(--muted)", fontSize: "12px" }}>
        {student.phone || "—"}
      </td>
      <td>
        <div className="actions">
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => onEdit(student)}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => onDelete(student)}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default StudentCard;
