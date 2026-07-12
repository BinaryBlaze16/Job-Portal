import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  LuBriefcase, LuClock, LuUsers, LuCircleCheck, LuBookmark,
  LuUser, LuPlus, LuX, LuSave, LuTrash2, LuEye, LuHeart,
} from 'react-icons/lu';
import { useAuth } from '../context/AuthContext';
import { getMyApplications, getSavedJobs, saveJob } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import JobCard from '../components/JobCard';
import toast from 'react-hot-toast';

const formatDate = (d) => {
  if (!d) return '';
  const date = new Date(d);
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const getResumeLink = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5001';
  return `${baseUrl}${url}`;
};

const SeekerDashboard = () => {
  const { user, updateUser } = useAuth();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'profile' ? 'profile' : 'applications';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [loadingSaved, setLoadingSaved] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  // Profile form
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    skills: user?.skills || [],
    experience: user?.experience || [],
    education: user?.education || [],
    resumeUrl: user?.resumeUrl || '',
  });
  const [skillInput, setSkillInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    if (activeTab === 'applications') fetchApplications();
    if (activeTab === 'saved') fetchSavedJobs();
  }, [activeTab]);

  const fetchApplications = async () => {
    setLoadingApps(true);
    try {
      const { data } = await getMyApplications();
      setApplications(data.applications || data.data || data || []);
    } catch {
      setApplications([]);
    } finally {
      setLoadingApps(false);
    }
  };

  const fetchSavedJobs = async () => {
    setLoadingSaved(true);
    try {
      const { data } = await getSavedJobs();
      setSavedJobs(data.jobs || data.data || data || []);
    } catch {
      setSavedJobs([]);
    } finally {
      setLoadingSaved(false);
    }
  };

  const handleRemoveSaved = async (jobId) => {
    try {
      await saveJob(jobId);
      setSavedJobs((prev) => prev.filter((j) => (j._id || j.job?._id) !== jobId));
      toast.success('Job removed from saved');
    } catch {
      toast.error('Failed to remove');
    }
  };

  const addSkill = (e) => {
    e.preventDefault();
    const s = skillInput.trim();
    if (s && !profile.skills.includes(s)) {
      setProfile({ ...profile, skills: [...profile.skills, s] });
    }
    setSkillInput('');
  };

  const removeSkill = (skill) => {
    setProfile({ ...profile, skills: profile.skills.filter((s) => s !== skill) });
  };

  const addExperience = () => {
    setProfile({
      ...profile,
      experience: [...profile.experience, { title: '', company: '', from: '', to: '', description: '' }],
    });
  };

  const updateExperience = (index, field, value) => {
    const updated = [...profile.experience];
    updated[index] = { ...updated[index], [field]: value };
    setProfile({ ...profile, experience: updated });
  };

  const removeExperience = (index) => {
    setProfile({ ...profile, experience: profile.experience.filter((_, i) => i !== index) });
  };

  const addEducation = () => {
    setProfile({
      ...profile,
      education: [...profile.education, { degree: '', institution: '', year: '' }],
    });
  };

  const updateEducation = (index, field, value) => {
    const updated = [...profile.education];
    updated[index] = { ...updated[index], [field]: value };
    setProfile({ ...profile, education: updated });
  };

  const removeEducation = (index) => {
    setProfile({ ...profile, education: profile.education.filter((_, i) => i !== index) });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', profile.name);
      formData.append('email', profile.email);
      formData.append('phone', profile.phone);
      formData.append('bio', profile.bio);
      formData.append('skills', JSON.stringify(profile.skills));
      formData.append('experience', JSON.stringify(profile.experience));
      formData.append('education', JSON.stringify(profile.education));
      formData.append('resumeUrl', profile.resumeUrl);

      if (resumeFile) {
        formData.append('resume', resumeFile);
      }

      const updated = await updateUser(formData);
      setProfile((prev) => ({
        ...prev,
        resumeUrl: updated.resumeUrl || prev.resumeUrl,
      }));
      setResumeFile(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const filteredApps = statusFilter === 'all'
    ? applications
    : applications.filter((a) => (a.status || 'applied').toLowerCase() === statusFilter);

  const stats = {
    total: applications.length,
    review: applications.filter((a) => ['under-review', 'reviewing', 'pending'].includes((a.status || '').toLowerCase())).length,
    interview: applications.filter((a) => (a.status || '').toLowerCase() === 'interview').length,
    accepted: applications.filter((a) => ['accepted', 'hired'].includes((a.status || '').toLowerCase())).length,
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, <span className="gradient-text">{user?.name || 'User'}</span></h1>
        <p className="text-secondary">Manage your job applications and profile</p>
      </div>

      {/* Stats */}
      <div className="dashboard-stats">
        <div className="dash-stat-card glass-card">
          <div className="dash-stat-icon blue"><LuBriefcase size={22} /></div>
          <div className="dash-stat-info">
            <span className="dash-stat-value">{stats.total}</span>
            <span className="dash-stat-label">Total Applications</span>
          </div>
        </div>
        <div className="dash-stat-card glass-card">
          <div className="dash-stat-icon amber"><LuClock size={22} /></div>
          <div className="dash-stat-info">
            <span className="dash-stat-value">{stats.review}</span>
            <span className="dash-stat-label">Under Review</span>
          </div>
        </div>
        <div className="dash-stat-card glass-card">
          <div className="dash-stat-icon cyan"><LuUsers size={22} /></div>
          <div className="dash-stat-info">
            <span className="dash-stat-value">{stats.interview}</span>
            <span className="dash-stat-label">Interviews</span>
          </div>
        </div>
        <div className="dash-stat-card glass-card">
          <div className="dash-stat-icon green"><LuCircleCheck size={22} /></div>
          <div className="dash-stat-info">
            <span className="dash-stat-value">{stats.accepted}</span>
            <span className="dash-stat-label">Accepted</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="dashboard-tabs">
        <button className={`dash-tab ${activeTab === 'applications' ? 'active' : ''}`} onClick={() => setActiveTab('applications')}>
          <LuBriefcase size={16} /> My Applications
        </button>
        <button className={`dash-tab ${activeTab === 'saved' ? 'active' : ''}`} onClick={() => setActiveTab('saved')}>
          <LuBookmark size={16} /> Saved Jobs
        </button>
        <button className={`dash-tab ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
          <LuUser size={16} /> Profile
        </button>
      </div>

      <div className="dashboard-content">
        {/* Applications */}
        {activeTab === 'applications' && (
          <div className="dash-panel">
            <div className="panel-toolbar">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
                <option value="all">All Statuses</option>
                <option value="applied">Applied</option>
                <option value="under-review">Under Review</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="interview">Interview</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {loadingApps ? (
              <div className="loading-placeholder"><div className="spinner" /></div>
            ) : filteredApps.length > 0 ? (
              <div className="applications-list">
                {filteredApps.map((app) => (
                  <div key={app._id} className="application-card glass-card">
                    <div className="app-card-main">
                      <div className="app-card-info">
                        <h3>{app.job?.title || app.jobTitle || 'Job Title'}</h3>
                        <p className="text-secondary">{app.job?.companyName || app.companyName || 'Company'}</p>
                      </div>
                      <div className="app-card-meta">
                        <span className="text-muted">{formatDate(app.createdAt || app.appliedAt)}</span>
                        <StatusBadge status={app.status || 'applied'} />
                      </div>
                    </div>
                    {app.statusHistory?.length > 0 && (
                      <div className="app-timeline">
                        {app.statusHistory.map((sh, i) => (
                          <div key={i} className="timeline-item">
                            <div className="timeline-dot" />
                            <div className="timeline-content">
                              <span className="timeline-status">{sh.status}</span>
                              <span className="timeline-date">{formatDate(sh.date || sh.updatedAt)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <LuBriefcase size={48} />
                <h3>No Applications Yet</h3>
                <p>Start applying to jobs to see them here</p>
              </div>
            )}
          </div>
        )}

        {/* Saved Jobs */}
        {activeTab === 'saved' && (
          <div className="dash-panel">
            {loadingSaved ? (
              <div className="loading-placeholder"><div className="spinner" /></div>
            ) : savedJobs.length > 0 ? (
              <div className="jobs-grid">
                {savedJobs.map((item) => {
                  const j = item.job || item;
                  return (
                    <div key={j._id} className="saved-job-wrapper">
                      <JobCard job={j} />
                      <button className="remove-saved-btn" onClick={() => handleRemoveSaved(j._id)}>
                        <LuX size={14} /> Remove
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <LuHeart size={48} />
                <h3>No Saved Jobs</h3>
                <p>Bookmark jobs you're interested in</p>
              </div>
            )}
          </div>
        )}

        {/* Profile */}
        {activeTab === 'profile' && (
          <div className="dash-panel">
            <form className="profile-form" onSubmit={handleSaveProfile}>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="tel" placeholder="+1 234 567 890" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                </div>
                 <div className="form-group">
                  <label>Resume (PDF File)</label>
                  <input type="file" accept="application/pdf" onChange={(e) => setResumeFile(e.target.files[0])} className="file-input" />
                  {profile.resumeUrl && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                      <a href={getResumeLink(profile.resumeUrl)} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>
                        View current resume PDF
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Bio</label>
                <textarea rows={4} placeholder="Tell us about yourself..." value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} className="form-textarea" />
              </div>

              {/* Skills */}
              <div className="form-group">
                <label>Skills</label>
                <div className="tags-input-wrapper">
                  <div className="tags-display">
                    {profile.skills.map((s, i) => (
                      <span key={i} className="skill-chip removable">
                        {s}
                        <button type="button" onClick={() => removeSkill(s)}><LuX size={12} /></button>
                      </span>
                    ))}
                  </div>
                  <div className="tag-input-form">
                    <input
                      type="text"
                      placeholder="Type a skill and press Enter..."
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSkill(e);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Experience */}
              <div className="form-group">
                <div className="form-group-header">
                  <label>Experience</label>
                  <button type="button" className="btn btn-outline btn-xs" onClick={addExperience}>
                    <LuPlus size={14} /> Add
                  </button>
                </div>
                {profile.experience.map((exp, i) => (
                  <div key={i} className="nested-form-card glass-card">
                    <button type="button" className="nested-remove" onClick={() => removeExperience(i)}>
                      <LuTrash2 size={14} />
                    </button>
                    <div className="form-grid-2">
                      <div className="form-group">
                        <label>Title</label>
                        <input value={exp.title} onChange={(e) => updateExperience(i, 'title', e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Company</label>
                        <input value={exp.company} onChange={(e) => updateExperience(i, 'company', e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>From</label>
                        <input type="date" value={exp.from} onChange={(e) => updateExperience(i, 'from', e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>To</label>
                        <input type="date" value={exp.to} onChange={(e) => updateExperience(i, 'to', e.target.value)} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea rows={2} value={exp.description} onChange={(e) => updateExperience(i, 'description', e.target.value)} className="form-textarea" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Education */}
              <div className="form-group">
                <div className="form-group-header">
                  <label>Education</label>
                  <button type="button" className="btn btn-outline btn-xs" onClick={addEducation}>
                    <LuPlus size={14} /> Add
                  </button>
                </div>
                {profile.education.map((edu, i) => (
                  <div key={i} className="nested-form-card glass-card">
                    <button type="button" className="nested-remove" onClick={() => removeEducation(i)}>
                      <LuTrash2 size={14} />
                    </button>
                    <div className="form-grid-3">
                      <div className="form-group">
                        <label>Degree</label>
                        <input value={edu.degree} onChange={(e) => updateEducation(i, 'degree', e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Institution</label>
                        <input value={edu.institution} onChange={(e) => updateEducation(i, 'institution', e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Year</label>
                        <input type="number" value={edu.year} onChange={(e) => updateEducation(i, 'year', e.target.value)} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
                {saving ? <span className="spinner-sm" /> : <><LuSave size={16} /> Save Profile</>}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeekerDashboard;
