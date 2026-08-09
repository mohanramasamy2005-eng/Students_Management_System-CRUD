import { DEPARTMENTS } from "../utils/validation";

const FilterBar = ({ department, onDepartmentChange, sort, onSortChange }) => {
  return (
    <>
      <select
        className="filter-select"
        value={department}
        onChange={(e) => onDepartmentChange(e.target.value)}
      >
        <option value="">All Departments</option>
        {DEPARTMENTS.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
      <select
        className="filter-select"
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="name">Name (A-Z)</option>
        <option value="cgpa">Highest CGPA</option>
      </select>
    </>
  );
};

export default FilterBar;
