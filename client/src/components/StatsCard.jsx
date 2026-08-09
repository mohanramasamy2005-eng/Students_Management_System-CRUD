const StatsCard = ({ label, value, icon, color }) => {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${color}`}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke={icon.color}
          strokeWidth="2"
        >
          {icon.path}
        </svg>
      </div>
      <div>
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
      </div>
    </div>
  );
};

export default StatsCard;
