import { useState, useEffect } from 'react';
import {
  LuBriefcase, LuUsers, LuCircleCheck, LuPlus, LuTrash2, LuPenLine,
  LuToggleLeft, LuToggleRight, LuEye, LuSave, LuX, LuSend, LuBuilding2,
  LuClock, LuFileText, LuExternalLink,
} from 'react-icons/lu';
import { useAuth } from '../context/AuthContext';
import {
  getEmployerJobs, createJob, updateJob, deleteJob, toggleJobStatus,
  getJobApplications, updateApplicationStatus,
} from '../services/api';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';

const jobTypes = ['Full-time', 'Part-time', 'Remote', 'Internship', 'Contract'];
const experienceLevels = ['Entry', 'Mid', 'Senior', 'Lead'];
const categories = ['Technology', 'Design', 'Marketing', 'Finance', 'Engineering', 'Healthcare', 'Education', 'Sales', 'Legal', 'Other'];
const statusOptions = ['applied', 'under-review', 'shortlisted', 'interview', 'accepted', 'rejected'];

const emptyJob = {
  title: '', description: '', location: '', salaryMin: '', salaryMax: '',
  jobType: 'Full-time', category: 'Technology', experienceLevel: 'Entry',
  skills: [], requirements: [''], responsibilities: [''], benefits: [''],
  applicationDeadline: '',
};

const formatDate = (d) => {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const EmployerDashboard = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('jobs');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Post/Edit job
  const [jobModal, setJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobForm, setJobForm] = useState({ ...emptyJob });
  const [skillInput, setSkillInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Applicants
  const [selectedJobId, setSelectedJobId] = useState('');
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  // Company profile
  const [companyForm, setCompanyForm] = useState({
    companyName: user?.companyName || '',
    companyDescription: user?.companyDescription || '',
    website: user?.website || '',
    industry: user?.industry || '',
    companySize: user?.companySize || '',
    logoUrl: user?.logoUrl || '',
  });
  const [savingCompany, setSavingCompany] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data } = await getEmployerJobs();
      setJobs(data.jobs || data.data || data || []);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const openPostModal = () => {
    setEditingJob(null);
    setJobForm({ ...emptyJob });
    setJobModal(true);
  };

  const openEditModal = (job) => {
    setEditingJob(job);
    setJobForm({
      title: job.title || '',
      description: job.description || '',
      location: job.location || '',
      salaryMin: job.salaryMin || job.salary?.min || '',
      salaryMax: job.salaryMax || job.salary?.max || '',
      jobType: job.jobType || 'Full-time',
      category: job.category || 'Technology',
      experienceLevel: job.experienceLevel || 'Entry',
      skills: job.skills || [],
      requirements: job.requirements?.length ? job.requirements : [''],
      responsibilities: job.responsibilities?.length ? job.responsibilities : [''],
      benefits: job.benefits?.length ? job.benefits : [''],
      applicationDeadline: job.applicationDeadline ? job.applicationDeadline.substring(0, 10) : '',
    });
    setJobModal(true);
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    const s = skillInput.trim();
    if (s && !jobForm.skills.includes(s)) {
      setJobForm({ ...jobForm, skills: [...jobForm.skills, s] });
    }
    setSkillInput('');
  };

  const handleListField = (field, index, value) => {
    const list = [...jobForm[field]];
    list[index] = value;
    setJobForm({ ...jobForm, [field]: list });
  };

  const addListItem = (field) => {
    setJobForm({ ...jobForm, [field]: [...jobForm[field], ''] });
  };

  const removeListItem = (field, index) => {
    setJobForm({ ...jobForm, [field]: jobForm[field].filter((_, i) => i !== index) });
  };

  const handleSubmitJob = async (e) => {
    e.preventDefault();
    if (!jobForm.title.trim()) { toast.error('Title is required'); return; }
    if (!jobForm.description.trim()) { toast.error('Description is required'); return; }

    setSubmitting(true);
    try {
      const payload = {
        ...jobForm,
        requirements: jobForm.requirements.filter(Boolean),
        responsibilities: jobForm.responsibilities.filter(Boolean),
        benefits: jobForm.benefits.filter(Boolean),
      };
      if (editingJob) {
        await updateJob(editingJob._id, payload);
        toast.success('Job updated!');
      } else {
        await createJob(payload);
        toast.success('Job posted!');
      }
      setJobModal(false);
      fetchJobs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save job');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Delete this job listing?')) return;
    try {
      await deleteJob(id);
      toast.success('Job deleted');
      fetchJobs();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleJobStatus(id);
      fetchJobs();
    } catch {
      toast.error('Failed to toggle');
    }
  };

  const fetchApplicants = async (jobId) => {
    setSelectedJobId(jobId);
    setLoadingApplicants(true);
    try {
      const { data } = await getJobApplications(jobId);
      setApplicants(data.applications || data.data || data || []);
    } catch {
      setApplicants([]);
    } finally {
      setLoadingApplicants(false);
    }
  };

  const handleStatusChange = async (appId, status) => {
    try {
      await updateApplicationStatus(appId, { status });
      toast.success('Status updated');
      if (selectedJobId) fetchApplicants(selectedJobId);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleSaveCompany = async (e) => {
    e.preventDefault();
    setSavingCompany(true);
    try {
      await updateUser(companyForm);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSavingCompany(false);
    }
  };

  const totalApps = jobs.reduce((sum, j) => sum + (j.applicationsCount || j.applications?.length || 0), 0);
  const activeCount = jobs.filter((j) => j.status === 'active' || j.isActive !== false).length;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, <span className="gradient-text">{user?.companyName || user?.name || 'Employer'}</span></h1>
        <p className="text-secondary">Manage your job listings and applicants</p>
      </div>

      <div className="dashboard-stats">
        <div className="dash-stat-card glass-card">
          <div className="dash-stat-icon blue"><LuBriefcase size={22} /></div>
          <div className="dash-stat-info">
            <span className="dash-stat-value">{activeCount}</span>
            <span className="dash-stat-label">Active Jobs</span>
          </div>
        </div>
        <div className="dash-stat-card glass-card">
          <div className="dash-stat-icon amber"><LuUsers size={22} /></div>
          <div className="dash-stat-info">
            <span className="dash-stat-value">{totalApps}</span>
            <span className="dash-stat-label">Total Applications</span>
          </div>
        </div>
        <div className="dash-stat-card glass-card">
          <div className="dash-stat-icon purple"><LuFileText size={22} /></div>
          <div className="dash-stat-info">
            <span className="dash-stat-value">{jobs.length}</span>
            <span className="dash-stat-label">Total Jobs</span>
          </div>
        </div>
        <div className="dash-stat-card glass-card">
          <div className="dash-stat-icon green"><LuCircleCheck size={22} /></div>
          <div className="dash-stat-info">
            <span className="dash-stat-value">0</span>
            <span className="dash-stat-label">Positions Filled</span>
          </div>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button className={`dash-tab ${activeTab === 'jobs' ? 'active' : ''}`} onClick={() => setActiveTab('jobs')}>
          <LuBriefcase size={16} /> My Jobs
        </button>
        <button className={`dash-tab ${activeTab === 'post' ? 'active' : ''}`} onClick={() => { setActiveTab('post'); openPostModal(); }}>
          <LuPlus size={16} /> Post Job
        </button>
        <button className={`dash-tab ${activeTab === 'applicants' ? 'active' : ''}`} onClick={() => setActiveTab('applicants')}>
          <LuUsers size={16} /> Applicants
        </button>
        <button className={`dash-tab ${activeTab === 'company' ? 'active' : ''}`} onClick={() => setActiveTab('company')}>
          <LuBuilding2 size={16} /> Company Profile
        </button>
      </div>

      <div className="dashboard-content">
        {/* My Jobs */}
        {activeTab === 'jobs' && (
          <div className="dash-panel">
            <div className="panel-toolbar">
              <button className="btn btn-primary btn-sm" onClick={openPostModal}>
                <LuPlus size={14} /> Post New Job
              </button>
            </div>

            {loading ? (
              <div className="loading-placeholder"><div className="spinner" /></div>
            ) : jobs.length > 0 ? (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Applications</th>
                      <th>Status</th>
                      <th>Posted</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job) => (
                      <tr key={job._id}>
                        <td className="table-title">{job.title}</td>
                        <td>{job.applicationsCount || job.applications?.length || 0}</td>
                        <td><StatusBadge status={job.status || (job.isActive !== false ? 'active' : 'inactive')} /></td>
                        <td className="text-muted">{formatDate(job.createdAt)}</td>
                        <td>
                          <div className="table-actions">
                            <button className="action-btn" title="Edit" onClick={() => openEditModal(job)}>
                              <LuPenLine size={15} />
                            </button>
                            <button className="action-btn" title="Toggle" onClick={() => handleToggle(job._id)}>
                              {job.isActive !== false ? <LuToggleRight size={15} /> : <LuToggleLeft size={15} />}
                            </button>
                            <button className="action-btn danger" title="Delete" onClick={() => handleDeleteJob(job._id)}>
                              <LuTrash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <LuBriefcase size={48} />
                <h3>No Job Listings</h3>
                <p>Post your first job to start receiving applications</p>
                <button className="btn btn-primary" onClick={openPostModal}><LuPlus size={14} /> Post a Job</button>
              </div>
            )}
          </div>
        )}

        {/* Applicants */}
        {activeTab === 'applicants' && (
          <div className="dash-panel">
            <div className="panel-toolbar">
              <select
                className="filter-select"
                value={selectedJobId}
                onChange={(e) => fetchApplicants(e.target.value)}
              >
                <option value="">Select a job...</option>
                {jobs.map((j) => (
                  <option key={j._id} value={j._id}>{j.title}</option>
                ))}
              </select>
            </div>

            {!selectedJobId ? (
              <div className="empty-state">
                <LuUsers size={48} />
                <h3>Select a Job</h3>
                <p>Choose a job listing above to view its applicants</p>
              </div>
            ) : loadingApplicants ? (
              <div className="loading-placeholder"><div className="spinner" /></div>
            ) : applicants.length > 0 ? (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Applied</th>
                      <th>Status</th>
                      <th>Resume</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applicants.map((app) => (
                      <tr key={app._id}>
                        <td className="table-title">{app.applicant?.name || app.name || 'Applicant'}</td>
                        <td className="text-secondary">{app.applicant?.email || app.email || ''}</td>
                        <td className="text-muted">{formatDate(app.createdAt || app.appliedAt)}</td>
                        <td><StatusBadge status={app.status || 'applied'} /></td>
                        <td>
                          {(app.resumeUrl || app.applicant?.resumeUrl) ? (
                            <a href={app.resumeUrl || app.applicant?.resumeUrl} target="_blank" rel="noreferrer" className="resume-link">
                              <LuExternalLink size={14} /> View
                            </a>
                          ) : (
                            <span className="text-muted">N/A</span>
                          )}
                        </td>
                        <td>
                          <select
                            className="status-select"
                            value={app.status || 'applied'}
                            onChange={(e) => handleStatusChange(app._id, e.target.value)}
                          >
                            {statusOptions.map((s) => (
                              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <LuUsers size={48} />
                <h3>No Applicants Yet</h3>
                <p>No one has applied to this position yet</p>
              </div>
            )}
          </div>
        )}

        {/* Company Profile */}
        {activeTab === 'company' && (
          <div className="dash-panel">
            <form className="profile-form" onSubmit={handleSaveCompany}>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Company Name</label>
                  <input value={companyForm.companyName} onChange={(e) => setCompanyForm({ ...companyForm, companyName: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Website</label>
                  <input type="url" placeholder="https://..." value={companyForm.website} onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Industry</label>
                  <select className="filter-select" value={companyForm.industry} onChange={(e) => setCompanyForm({ ...companyForm, industry: e.target.value })}>
                    <option value="">Select industry</option>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Company Size</label>
                  <input placeholder="e.g. 50-200" value={companyForm.companySize} onChange={(e) => setCompanyForm({ ...companyForm, companySize: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Company Description</label>
                <textarea rows={5} placeholder="Tell candidates about your company..." value={companyForm.companyDescription} onChange={(e) => setCompanyForm({ ...companyForm, companyDescription: e.target.value })} className="form-textarea" />
              </div>
              <div className="form-group">
                <label>Logo URL</label>
                <input type="url" placeholder="https://..." value={companyForm.logoUrl} onChange={(e) => setCompanyForm({ ...companyForm, logoUrl: e.target.value })} />
              </div>
              <button type="submit" className="btn btn-primary btn-lg" disabled={savingCompany}>
                {savingCompany ? <span className="spinner-sm" /> : <><LuSave size={16} /> Save Company Profile</>}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Post/Edit Job Modal */}
      <Modal isOpen={jobModal} onClose={() => setJobModal(false)} title={editingJob ? 'Edit Job' : 'Post New Job'} size="lg">
        <form className="job-post-form" onSubmit={handleSubmitJob}>
          <div className="form-group">
            <label>Job Title *</label>
            <input value={jobForm.title} onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })} placeholder="e.g. Senior React Developer" />
          </div>
          <div className="form-group">
            <label>Description *</label>
            <textarea rows={5} value={jobForm.description} onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })} placeholder="Describe the role in detail..." className="form-textarea" />
          </div>
          <div className="form-grid-3">
            <div className="form-group">
              <label>Location</label>
              <input value={jobForm.location} onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })} placeholder="City or Remote" />
            </div>
            <div className="form-group">
              <label>Salary Min</label>
              <input type="number" value={jobForm.salaryMin} onChange={(e) => setJobForm({ ...jobForm, salaryMin: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Salary Max</label>
              <input type="number" value={jobForm.salaryMax} onChange={(e) => setJobForm({ ...jobForm, salaryMax: e.target.value })} />
            </div>
          </div>
          <div className="form-grid-3">
            <div className="form-group">
              <label>Job Type</label>
              <select className="filter-select" value={jobForm.jobType} onChange={(e) => setJobForm({ ...jobForm, jobType: e.target.value })}>
                {jobTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Category</label>
              <select className="filter-select" value={jobForm.category} onChange={(e) => setJobForm({ ...jobForm, category: e.target.value })}>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Experience Level</label>
              <select className="filter-select" value={jobForm.experienceLevel} onChange={(e) => setJobForm({ ...jobForm, experienceLevel: e.target.value })}>
                {experienceLevels.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          {/* Skills */}
          <div className="form-group">
            <label>Skills</label>
            <div className="tags-input-wrapper">
              <div className="tags-display">
                {jobForm.skills.map((s, i) => (
                  <span key={i} className="skill-chip removable">
                    {s}
                    <button type="button" onClick={() => setJobForm({ ...jobForm, skills: jobForm.skills.filter((_, j) => j !== i) })}>
                      <LuX size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="tag-input-form">
                <input
                  placeholder="Type skill and press Enter..."
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill(e);
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="form-group">
            <div className="form-group-header">
              <label>Requirements</label>
              <button type="button" className="btn btn-outline btn-xs" onClick={() => addListItem('requirements')}><LuPlus size={12} /></button>
            </div>
            {jobForm.requirements.map((r, i) => (
              <div key={i} className="list-input-row">
                <input value={r} onChange={(e) => handleListField('requirements', i, e.target.value)} placeholder={`Requirement ${i + 1}`} />
                {jobForm.requirements.length > 1 && (
                  <button type="button" className="list-remove-btn" onClick={() => removeListItem('requirements', i)}><LuX size={14} /></button>
                )}
              </div>
            ))}
          </div>

          {/* Responsibilities */}
          <div className="form-group">
            <div className="form-group-header">
              <label>Responsibilities</label>
              <button type="button" className="btn btn-outline btn-xs" onClick={() => addListItem('responsibilities')}><LuPlus size={12} /></button>
            </div>
            {jobForm.responsibilities.map((r, i) => (
              <div key={i} className="list-input-row">
                <input value={r} onChange={(e) => handleListField('responsibilities', i, e.target.value)} placeholder={`Responsibility ${i + 1}`} />
                {jobForm.responsibilities.length > 1 && (
                  <button type="button" className="list-remove-btn" onClick={() => removeListItem('responsibilities', i)}><LuX size={14} /></button>
                )}
              </div>
            ))}
          </div>

          {/* Benefits */}
          <div className="form-group">
            <div className="form-group-header">
              <label>Benefits</label>
              <button type="button" className="btn btn-outline btn-xs" onClick={() => addListItem('benefits')}><LuPlus size={12} /></button>
            </div>
            {jobForm.benefits.map((b, i) => (
              <div key={i} className="list-input-row">
                <input value={b} onChange={(e) => handleListField('benefits', i, e.target.value)} placeholder={`Benefit ${i + 1}`} />
                {jobForm.benefits.length > 1 && (
                  <button type="button" className="list-remove-btn" onClick={() => removeListItem('benefits', i)}><LuX size={14} /></button>
                )}
              </div>
            ))}
          </div>

          <div className="form-group">
            <label>Application Deadline</label>
            <input type="date" value={jobForm.applicationDeadline} onChange={(e) => setJobForm({ ...jobForm, applicationDeadline: e.target.value })} />
          </div>

          <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={submitting}>
            {submitting ? <span className="spinner-sm" /> : <><LuSend size={16} /> {editingJob ? 'Update Job' : 'Post Job'}</>}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default EmployerDashboard;
