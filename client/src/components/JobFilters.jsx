import { useState } from 'react';
import { LuSearch, LuMapPin, LuFilter, LuX, LuChevronDown, LuChevronUp } from 'react-icons/lu';

const jobTypes = ['Full-time', 'Part-time', 'Remote', 'Internship', 'Contract'];
const experienceLevels = ['Entry', 'Mid', 'Senior', 'Lead'];
const categories = [
  'Technology', 'Design', 'Marketing', 'Finance', 'Engineering',
  'Healthcare', 'Education', 'Sales', 'Legal', 'Other',
];

const JobFilters = ({ filters, onChange, onClear }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSections, setOpenSections] = useState({
    location: true,
    jobType: true,
    experience: true,
    salary: false,
    category: false,
  });

  const toggleSection = (key) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  const handleCheckbox = (key, value) => {
    const current = filters[key] || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    handleChange(key, updated);
  };

  const content = (
    <div className="filters-content">
      {/* Search */}
      <div className="filter-search">
        <LuSearch size={18} className="filter-search-icon" />
        <input
          type="text"
          placeholder="Job title or keyword..."
          value={filters.search || ''}
          onChange={(e) => handleChange('search', e.target.value)}
          className="filter-input"
        />
      </div>

      {/* Location */}
      <div className="filter-section">
        <button className="filter-section-toggle" onClick={() => toggleSection('location')}>
          <span><LuMapPin size={16} /> Location</span>
          {openSections.location ? <LuChevronUp size={16} /> : <LuChevronDown size={16} />}
        </button>
        {openSections.location && (
          <div className="filter-section-body">
            <input
              type="text"
              placeholder="City or remote..."
              value={filters.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
              className="filter-input"
            />
          </div>
        )}
      </div>

      {/* Job Type */}
      <div className="filter-section">
        <button className="filter-section-toggle" onClick={() => toggleSection('jobType')}>
          <span>Job Type</span>
          {openSections.jobType ? <LuChevronUp size={16} /> : <LuChevronDown size={16} />}
        </button>
        {openSections.jobType && (
          <div className="filter-section-body">
            {jobTypes.map((type) => (
              <label key={type} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={(filters.jobType || []).includes(type)}
                  onChange={() => handleCheckbox('jobType', type)}
                />
                <span className="checkmark" />
                <span>{type}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Experience Level */}
      <div className="filter-section">
        <button className="filter-section-toggle" onClick={() => toggleSection('experience')}>
          <span>Experience Level</span>
          {openSections.experience ? <LuChevronUp size={16} /> : <LuChevronDown size={16} />}
        </button>
        {openSections.experience && (
          <div className="filter-section-body">
            {experienceLevels.map((level) => (
              <label key={level} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={(filters.experience || []).includes(level)}
                  onChange={() => handleCheckbox('experience', level)}
                />
                <span className="checkmark" />
                <span>{level}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Salary Range */}
      <div className="filter-section">
        <button className="filter-section-toggle" onClick={() => toggleSection('salary')}>
          <span>Salary Range</span>
          {openSections.salary ? <LuChevronUp size={16} /> : <LuChevronDown size={16} />}
        </button>
        {openSections.salary && (
          <div className="filter-section-body">
            <div className="filter-salary-row">
              <input
                type="number"
                placeholder="Min"
                value={filters.salaryMin || ''}
                onChange={(e) => handleChange('salaryMin', e.target.value)}
                className="filter-input"
              />
              <span className="filter-salary-divider">—</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.salaryMax || ''}
                onChange={(e) => handleChange('salaryMax', e.target.value)}
                className="filter-input"
              />
            </div>
          </div>
        )}
      </div>

      {/* Category */}
      <div className="filter-section">
        <button className="filter-section-toggle" onClick={() => toggleSection('category')}>
          <span>Category</span>
          {openSections.category ? <LuChevronUp size={16} /> : <LuChevronDown size={16} />}
        </button>
        {openSections.category && (
          <div className="filter-section-body">
            <select
              value={filters.category || ''}
              onChange={(e) => handleChange('category', e.target.value)}
              className="filter-select"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="filter-actions">
        <button className="btn btn-outline btn-sm" onClick={onClear}>
          <LuX size={14} /> Clear All
        </button>
      </div>
    </div>
  );

  return (
    <aside className="job-filters">
      <div className="filters-header">
        <h3><LuFilter size={18} /> Filters</h3>
        <button className="filter-mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <LuX size={20} /> : <LuFilter size={20} />}
        </button>
      </div>
      <div className={`filters-body ${mobileOpen ? 'active' : ''}`}>{content}</div>
    </aside>
  );
};

export default JobFilters;
