import { useNavigate } from 'react-router-dom';
import { LuMapPin, LuClock, LuUsers, LuHeart, LuBookmark } from 'react-icons/lu';
import { useAuth } from '../context/AuthContext';
import { saveJob } from '../services/api';
import toast from 'react-hot-toast';
import { useState } from 'react';

const formatSalary = (min, max) => {
  const fmt = (n) => {
    if (n >= 1000) return `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
    return `$${n}`;
  };
  if (min && max) return `${fmt(min)} — ${fmt(max)}`;
  if (min) return `From ${fmt(min)}`;
  if (max) return `Up to ${fmt(max)}`;
  return 'Competitive';
};

const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
};

const JobCard = ({ job, onSaveToggle }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(job.isSaved || false);

  const handleSave = async (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to save jobs');
      return;
    }
    setSaving(true);
    try {
      await saveJob(job._id);
      setIsSaved(!isSaved);
      toast.success(isSaved ? 'Job unsaved' : 'Job saved!');
      if (onSaveToggle) onSaveToggle(job._id);
    } catch (err) {
      toast.error('Failed to save job');
    } finally {
      setSaving(false);
    }
  };

  const skills = job.skills || [];
  const displaySkills = skills.slice(0, 3);
  const moreCount = skills.length - 3;

  return (
    <div className="job-card" onClick={() => navigate(`/jobs/${job._id}`)}>
      <div className="job-card-header">
        <div className="job-card-company-logo">
          {(job.companyName || job.company?.name || 'C').charAt(0).toUpperCase()}
        </div>
        <div className="job-card-title-group">
          <h3 className="job-card-title">{job.title}</h3>
          <p className="job-card-company">{job.companyName || job.company?.name || 'Company'}</p>
        </div>
        <button
          className={`job-card-save ${isSaved ? 'saved' : ''}`}
          onClick={handleSave}
          disabled={saving}
          aria-label="Save job"
        >
          {isSaved ? <LuHeart size={18} fill="currentColor" /> : <LuBookmark size={18} />}
        </button>
      </div>

      <div className="job-card-meta">
        <span className="job-meta-item">
          <LuMapPin size={14} /> {job.location || 'Remote'}
        </span>
        <span className="job-meta-item">
          <LuClock size={14} /> {timeAgo(job.createdAt)}
        </span>
        {job.applicationsCount !== undefined && (
          <span className="job-meta-item">
            <LuUsers size={14} /> {job.applicationsCount} applicants
          </span>
        )}
      </div>

      <div className="job-card-salary">{formatSalary(job.salaryMin || job.salary?.min, job.salaryMax || job.salary?.max)}</div>

      <div className="job-card-footer">
        <span className={`job-type-badge ${(job.jobType || 'full-time').toLowerCase().replace(/[\s-]+/g, '-')}`}>
          {job.jobType || 'Full-time'}
        </span>
        <div className="job-card-skills">
          {displaySkills.map((s, i) => (
            <span key={i} className="skill-chip">{s}</span>
          ))}
          {moreCount > 0 && <span className="skill-chip more">+{moreCount}</span>}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
