import { useState, useEffect } from 'react';
import {
  LuUsers, LuBriefcase, LuFileText, LuBuilding2, LuToggleLeft,
  LuToggleRight, LuTrendingUp, LuActivity, LuShield, LuTrash2,
} from 'react-icons/lu';
import { getAllUsers, getAllJobs, toggleUserStatus, getPlatformStats, deleteJob } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import toast from 'react-hot-toast';

const formatDate = (d) => {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({});
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchJobs();
  }, []);

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const { data } = await getPlatformStats();
      const s = data.data || {};
      setStats({
        totalUsers: s.users?.total || 0,
        totalJobs: s.jobs?.total || 0,
        totalApplications: s.applications?.total || 0,
        activeEmployers: s.users?.employers || 0
      });
    } catch {
      setStats({});
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data } = await getAllUsers();
      setUsers(data.users || data.data || data || []);
    } catch {
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchJobs = async () => {
    setLoadingJobs(true);
    try {
      const { data } = await getAllJobs();
      setJobs(data.jobs || data.data || data || []);
    } catch {
      setJobs([]);
    } finally {
      setLoadingJobs(false);
    }
  };

  const handleToggleUser = async (id) => {
    try {
      await toggleUserStatus(id);
      toast.success('User status updated');
      fetchUsers();
    } catch {
      toast.error('Failed to update user');
    }
  };

  const handleDeleteJob = async (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await deleteJob(id);
        toast.success('Job deleted successfully');
        fetchJobs();
        fetchStats();
      } catch {
        toast.error('Failed to delete job');
      }
    }
  };

  const totalUsers = stats.totalUsers || users.length;
  const totalJobs = stats.totalJobs || jobs.length;
  const totalApps = stats.totalApplications || 0;
  const activeEmployers = stats.activeEmployers || users.filter((u) => u.role === 'employer').length;

  // Activity feed
  const recentUsers = [...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  const recentJobs = [...jobs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  // Simple chart data - role distribution
  const seekerCount = users.filter((u) => u.role === 'seeker').length;
  const employerCount = users.filter((u) => u.role === 'employer').length;
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const maxRole = Math.max(seekerCount, employerCount, adminCount, 1);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1><span className="gradient-text">Admin</span> Dashboard</h1>
        <p className="text-secondary">Platform overview and management</p>
      </div>

      <div className="dashboard-stats">
        <div className="dash-stat-card glass-card">
          <div className="dash-stat-icon blue"><LuUsers size={22} /></div>
          <div className="dash-stat-info">
            <span className="dash-stat-value">{totalUsers}</span>
            <span className="dash-stat-label">Total Users</span>
          </div>
        </div>
        <div className="dash-stat-card glass-card">
          <div className="dash-stat-icon amber"><LuBriefcase size={22} /></div>
          <div className="dash-stat-info">
            <span className="dash-stat-value">{totalJobs}</span>
            <span className="dash-stat-label">Total Jobs</span>
          </div>
        </div>
        <div className="dash-stat-card glass-card">
          <div className="dash-stat-icon purple"><LuFileText size={22} /></div>
          <div className="dash-stat-info">
            <span className="dash-stat-value">{totalApps}</span>
            <span className="dash-stat-label">Total Applications</span>
          </div>
        </div>
        <div className="dash-stat-card glass-card">
          <div className="dash-stat-icon green"><LuBuilding2 size={22} /></div>
          <div className="dash-stat-info">
            <span className="dash-stat-value">{activeEmployers}</span>
            <span className="dash-stat-label">Active Employers</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="admin-charts glass-card">
        <h3><LuTrendingUp size={18} /> User Distribution</h3>
        <div className="bar-chart">
          <div className="bar-item">
            <span className="bar-label">Job Seekers</span>
            <div className="bar-track">
              <div className="bar-fill blue" style={{ width: `${(seekerCount / maxRole) * 100}%` }} />
            </div>
            <span className="bar-value">{seekerCount}</span>
          </div>
          <div className="bar-item">
            <span className="bar-label">Employers</span>
            <div className="bar-track">
              <div className="bar-fill purple" style={{ width: `${(employerCount / maxRole) * 100}%` }} />
            </div>
            <span className="bar-value">{employerCount}</span>
          </div>
          <div className="bar-item">
            <span className="bar-label">Admins</span>
            <div className="bar-track">
              <div className="bar-fill green" style={{ width: `${(adminCount / maxRole) * 100}%` }} />
            </div>
            <span className="bar-value">{adminCount}</span>
          </div>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button className={`dash-tab ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
          <LuUsers size={16} /> Users
        </button>
        <button className={`dash-tab ${activeTab === 'jobs' ? 'active' : ''}`} onClick={() => setActiveTab('jobs')}>
          <LuBriefcase size={16} /> Jobs
        </button>
        <button className={`dash-tab ${activeTab === 'activity' ? 'active' : ''}`} onClick={() => setActiveTab('activity')}>
          <LuActivity size={16} /> Recent Activity
        </button>
      </div>

      <div className="dashboard-content">
        {/* Users */}
        {activeTab === 'users' && (
          <div className="dash-panel">
            {loadingUsers ? (
              <div className="loading-placeholder"><div className="spinner" /></div>
            ) : (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id}>
                        <td className="table-title">{u.name}</td>
                        <td className="text-secondary">{u.email}</td>
                        <td>
                          <span className={`role-badge ${u.role}`}>
                            {u.role === 'admin' ? <LuShield size={12} /> : null}
                            {u.role}
                          </span>
                        </td>
                        <td><StatusBadge status={u.isActive !== false ? 'active' : 'inactive'} /></td>
                        <td className="text-muted">{formatDate(u.createdAt)}</td>
                        <td>
                          <button
                            className={`action-btn ${u.isActive !== false ? 'danger' : 'success'}`}
                            onClick={() => handleToggleUser(u._id)}
                            title={u.isActive !== false ? 'Deactivate' : 'Activate'}
                          >
                            {u.isActive !== false ? <LuToggleRight size={18} /> : <LuToggleLeft size={18} />}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Jobs */}
        {activeTab === 'jobs' && (
          <div className="dash-panel">
            {loadingJobs ? (
              <div className="loading-placeholder"><div className="spinner" /></div>
            ) : (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Company</th>
                      <th>Status</th>
                      <th>Posted</th>
                      <th>Applications</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((j) => (
                      <tr key={j._id}>
                        <td className="table-title">{j.title}</td>
                        <td className="text-secondary">{j.companyName || j.company?.name || ''}</td>
                        <td><StatusBadge status={j.status || 'active'} /></td>
                        <td className="text-muted">{formatDate(j.createdAt)}</td>
                        <td>{j.applicationsCount || j.applications?.length || 0}</td>
                        <td>
                          <button
                            className="action-btn danger"
                            onClick={() => handleDeleteJob(j._id)}
                            title="Delete Job"
                          >
                            <LuTrash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Activity */}
        {activeTab === 'activity' && (
          <div className="dash-panel">
            <div className="activity-feed">
              <h3 className="feed-heading">Recent Registrations</h3>
              {recentUsers.map((u) => (
                <div key={u._id} className="activity-item glass-card">
                  <div className="activity-avatar">{(u.name || 'U').charAt(0).toUpperCase()}</div>
                  <div className="activity-info">
                    <span className="activity-text"><strong>{u.name}</strong> registered as {u.role}</span>
                    <span className="activity-date">{formatDate(u.createdAt)}</span>
                  </div>
                </div>
              ))}

              <h3 className="feed-heading">Recent Job Posts</h3>
              {recentJobs.map((j) => (
                <div key={j._id} className="activity-item glass-card">
                  <div className="activity-avatar blue">{(j.title || 'J').charAt(0).toUpperCase()}</div>
                  <div className="activity-info">
                    <span className="activity-text"><strong>{j.title}</strong> posted by {j.companyName || j.company?.name || 'Unknown'}</span>
                    <span className="activity-date">{formatDate(j.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
