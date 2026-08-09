const LogoIcon = () => (
  <svg viewBox="0 0 18 18" fill="none">
    <rect x="2" y="2" width="6" height="6" rx="1.5" fill="#0d0d0d" />
    <rect x="10" y="2" width="6" height="6" rx="1.5" fill="#0d0d0d" />
    <rect x="2" y="10" width="6" height="6" rx="1.5" fill="#0d0d0d" />
    <rect x="10" y="10" width="6" height="6" rx="1.5" fill="#0d0d0d" />
  </svg>
);

const Navbar = ({ onAddStudent }) => {
  return (
    <div className="topbar">
      <div className="logo">
        <div className="logo-icon">
          <LogoIcon />
        </div>
        <div className="logo-text">
          STUDENT<span>_</span>DB
        </div>
      </div>
      <div className="topbar-actions">
        <button className="btn btn-primary" onClick={onAddStudent}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Student
        </button>
      </div>
    </div>
  );
};

export default Navbar;
