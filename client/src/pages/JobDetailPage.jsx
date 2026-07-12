import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  LuMapPin, LuClock, LuDollarSign, LuBriefcase, LuUsers,
  LuBookmark, LuHeart, LuExternalLink, LuBuilding2, LuCalendar,
  LuChevronRight, LuSend, LuCircleCheck, LuGraduationCap,
  LuAward, LuGift,
} from 'react-icons/lu';
import { getJob, applyToJob, saveJob, getJobs } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import JobCard from '../components/JobCard';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';

const formatSalary = (min, max) => {
  const fmt = (n) => `$${Number(n).toLocaleString()}`;
  if (min && max) return `${fmt(min)} — ${fmt(max)}`;
  if (min) return `From ${fmt(min)}`;
  if (max) return `Up to ${fmt(max)}`;
  return 'Competitive';
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = Date.now();
  const diff = Math.floor((now - d.getTime()) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const JobDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [applyForm, setApplyForm] = useState({ coverLetter: '', resumeUrl: '' });
  const [activeTab, setActiveTab] = useState('description');
  const [resumeSource, setResumeSource] = useState('profile');
  const [resumeFile, setResumeFile] = useState(null);

  // Update default resume source when user details change
  useEffect(() => {
    if (user?.resumeUrl) {
      setResumeSource('profile');
    } else {
      setResumeSource('file');
    }
  }, [user]);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await getJob(id);
        const j = data.data || data.job || data;
        setJob(j);
        setApplied(j.hasApplied || false);
        setSaved(j.isSaved || false);

        try {
          const { data: similar } = await getJobs({ category: j.category, limit: 4 });
          const list = (similar.jobs || similar.data || similar || []).filter(
            (s) => s._id !== id
          ).slice(0, 4);
          setSimilarJobs(list);
        } catch {}
      } catch {
        toast.error('Failed to load job');
      } finally {
        setLoading(false);
      }
    };
    fetch();
    window.scrollTo(0, 0);
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to apply'); return; }

    if (resumeSource === 'file' && !resumeFile) {
      toast.error('Please select a resume PDF file to upload');
      return;
    }
    if (resumeSource === 'url' && !applyForm.resumeUrl.trim()) {
      toast.error('Please enter your resume URL');
      return;
    }

    setApplying(true);
    try {
      const formData = new FormData();
      formData.append('coverLetter', applyForm.coverLetter);

      if (resumeSource === 'profile') {
        formData.append('resumeUrl', user.resumeUrl || '');
      } else if (resumeSource === 'url') {
        formData.append('resumeUrl', applyForm.resumeUrl);
      } else if (resumeSource === 'file') {
        formData.append('resume', resumeFile);
      }

      await applyToJob(id, formData);
      setApplied(true);
      setApplyModalOpen(false);
      toast.success('Application submitted successfully!');
      setResumeFile(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Application failed');
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async () => {
    if (!user) { toast.error('Please login to save jobs'); return; }
    try {
      await saveJob(id);
      setSaved(!saved);
      toast.success(saved ? 'Job unsaved' : 'Job saved!');
    } catch {
      toast.error('Failed to save job');
    }
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="empty-state" style={{ minHeight: '60vh' }}>
        <LuBriefcase size={56} />
        <h3>Job Not Found</h3>
        <Link to="/jobs" className="btn btn-primary">Browse Jobs</Link>
      </div>
    );
  }

  const salaryMin = job.salaryMin || job.salary?.min;
  const salaryMax = job.salaryMax || job.salary?.max;

  return (
    <div className="job-detail-page">
      {/* Breadcrumb */}
      <div className="breadcrumb container">
        <Link to="/">Home</Link>
        <LuChevronRight size={14} />
        <Link to="/jobs">Jobs</Link>
        <LuChevronRight size={14} />
        <span>{job.title}</span>
      </div>

      <div className="job-detail-container container">
        {/* Left column */}
        <div className="job-detail-main">
          <div className="job-detail-header glass-card">
            <div className="job-detail-company-logo">
              {(job.companyName || job.company?.name || 'C').charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="job-detail-title">{job.title}</h1>
              <p className="job-detail-company-name">{job.companyName || job.company?.name}</p>
              <div className="job-detail-meta">
                <span><LuMapPin size={16} /> {job.location || 'Remote'}</span>
                <span><LuClock size={16} /> {formatDate(job.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Quick info bar */}
          <div className="job-quick-info">
            <div className="quick-info-item">
              <LuBriefcase size={18} />
              <div>
                <span className="quick-label">Job Type</span>
                <span className="quick-value">{job.jobType || 'Full-time'}</span>
              </div>
            </div>
            <div className="quick-info-item">
              <LuGraduationCap size={18} />
              <div>
                <span className="quick-label">Experience</span>
                <span className="quick-value">{job.experienceLevel || job.experience || 'Any'}</span>
              </div>
            </div>
            <div className="quick-info-item">
              <LuDollarSign size={18} />
              <div>
                <span className="quick-label">Salary</span>
                <span className="quick-value">{formatSalary(salaryMin, salaryMax)}</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="detail-tabs">
            {['description', 'requirements', 'responsibilities', 'benefits'].map((t) => (
              <button
                key={t}
                className={`detail-tab ${activeTab === t ? 'active' : ''}`}
                onClick={() => setActiveTab(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          <div className="detail-tab-content glass-card">
            {activeTab === 'description' && (
              <div className="rich-text">
                {job.description ? (
                  job.description.split('\n').map((para, i) => <p key={i}>{para}</p>)
                ) : (
                  <p>No description provided.</p>
                )}
              </div>
            )}
            {activeTab === 'requirements' && (
              <ul className="detail-list">
                {(job.requirements || []).length > 0 ? (
                  job.requirements.map((r, i) => <li key={i}><LuCircleCheck size={16} className="list-icon" /> {r}</li>)
                ) : (
                  <p className="text-muted">No specific requirements listed.</p>
                )}
              </ul>
            )}
            {activeTab === 'responsibilities' && (
              <ul className="detail-list">
                {(job.responsibilities || []).length > 0 ? (
                  job.responsibilities.map((r, i) => <li key={i}><LuAward size={16} className="list-icon" /> {r}</li>)
                ) : (
                  <p className="text-muted">No responsibilities listed.</p>
                )}
              </ul>
            )}
            {activeTab === 'benefits' && (
              <ul className="detail-list">
                {(job.benefits || []).length > 0 ? (
                  job.benefits.map((b, i) => <li key={i}><LuGift size={16} className="list-icon" /> {b}</li>)
                ) : (
                  <p className="text-muted">No benefits listed.</p>
                )}
              </ul>
            )}
          </div>

          {/* Skills */}
          {job.skills?.length > 0 && (
            <div className="detail-skills glass-card">
              <h3>Skills Required</h3>
              <div className="skills-list">
                {job.skills.map((s, i) => <span key={i} className="skill-chip">{s}</span>)}
              </div>
            </div>
          )}
        </div>

        {/* Right column */}
        <aside className="job-detail-sidebar">
          <div className="sidebar-actions glass-card">
            {applied ? (
              <button className="btn btn-primary btn-lg btn-block" disabled>
                <LuCircleCheck size={18} /> Already Applied
              </button>
            ) : (
              <button
                className="btn btn-primary btn-lg btn-block"
                onClick={() => user ? setApplyModalOpen(true) : toast.error('Please login to apply')}
              >
                <LuSend size={18} /> Apply Now
              </button>
            )}
            <button className={`btn btn-outline btn-block ${saved ? 'saved' : ''}`} onClick={handleSave}>
              {saved ? <LuHeart size={18} fill="currentColor" /> : <LuBookmark size={18} />}
              {saved ? 'Saved' : 'Save Job'}
            </button>
          </div>

          <div className="sidebar-card glass-card">
            <h3><LuBuilding2 size={18} /> Company Info</h3>
            <div className="company-info-logo">
              {(job.companyName || job.company?.name || 'C').charAt(0).toUpperCase()}
            </div>
            <h4>{job.companyName || job.company?.name}</h4>
            {(job.industry || job.company?.industry) && (
              <p className="text-secondary">{job.industry || job.company?.industry}</p>
            )}
            {(job.companySize || job.company?.size) && (
              <p className="text-muted"><LuUsers size={14} /> {job.companySize || job.company?.size} employees</p>
            )}
            {(job.website || job.company?.website) && (
              <a href={job.website || job.company?.website} target="_blank" rel="noreferrer" className="company-website-link">
                <LuExternalLink size={14} /> Visit Website
              </a>
            )}
          </div>

          <div className="sidebar-card glass-card">
            <h3><LuCalendar size={18} /> Job Summary</h3>
            <div className="summary-row">
              <span className="text-muted">Posted</span>
              <span>{formatDate(job.createdAt)}</span>
            </div>
            {job.applicationDeadline && (
              <div className="summary-row">
                <span className="text-muted">Deadline</span>
                <span>{new Date(job.applicationDeadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
            )}
            <div className="summary-row">
              <span className="text-muted">Applications</span>
              <span>{job.applicationsCount ?? job.applications?.length ?? 0}</span>
            </div>
          </div>
        </aside>
      </div>

      {/* Similar Jobs */}
      {similarJobs.length > 0 && (
        <section className="similar-jobs container">
          <h2 className="section-title">Similar Jobs</h2>
          <div className="jobs-grid">
            {similarJobs.map((j) => (
              <JobCard key={j._id} job={j} />
            ))}
          </div>
        </section>
      )}

      {/* Apply Modal */}
      <Modal isOpen={applyModalOpen} onClose={() => setApplyModalOpen(false)} title="Apply for Position">
        <form className="apply-form" onSubmit={handleApply}>
          <div className="form-group">
            <label>Cover Letter</label>
            <textarea
              rows={6}
              placeholder="Tell the employer why you're a great fit for this role..."
              value={applyForm.coverLetter}
              onChange={(e) => setApplyForm({ ...applyForm, coverLetter: e.target.value })}
              className="form-textarea"
            />
          </div>
          <div className="form-group">
            <label>Resume Source</label>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', flexDirection: 'column' }}>
              {user?.resumeUrl && (
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="resumeSource"
                    value="profile"
                    checked={resumeSource === 'profile'}
                    onChange={() => setResumeSource('profile')}
                  />
                  <span>Use saved resume from profile</span>
                </label>
              )}
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="resumeSource"
                  value="file"
                  checked={resumeSource === 'file'}
                  onChange={() => setResumeSource('file')}
                />
                <span>Upload a new resume PDF</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="resumeSource"
                  value="url"
                  checked={resumeSource === 'url'}
                  onChange={() => setResumeSource('url')}
                />
                <span>Provide a link/URL to your resume</span>
              </label>
            </div>

            {resumeSource === 'file' && (
              <div style={{ marginTop: '0.5rem' }}>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  className="file-input"
                />
              </div>
            )}

            {resumeSource === 'url' && (
              <div style={{ marginTop: '0.5rem' }}>
                <input
                  type="url"
                  placeholder="https://drive.google.com/your-resume"
                  value={applyForm.resumeUrl}
                  onChange={(e) => setApplyForm({ ...applyForm, resumeUrl: e.target.value })}
                />
              </div>
            )}
          </div>
          <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={applying}>
            {applying ? <span className="spinner-sm" /> : <><LuSend size={16} /> Submit Application</>}
          </button>
        </form>
      </Modal>

      <Footer />
    </div>
  );
};

export default JobDetailPage;
