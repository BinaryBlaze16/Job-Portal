import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Request interceptor — attach JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth ────────────────────────────────────────────────────────────────────
export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);
export const getMe = () => API.get('/auth/me');
export const updateProfile = (data) => API.put('/auth/profile', data);

// ─── Jobs ────────────────────────────────────────────────────────────────────
export const getJobs = (params) => API.get('/jobs', { params });
export const getJob = (id) => API.get(`/jobs/${id}`);
export const createJob = (data) => API.post('/jobs', data);
export const updateJob = (id, data) => API.put(`/jobs/${id}`, data);
export const deleteJob = (id) => API.delete(`/jobs/${id}`);
export const getEmployerJobs = () => API.get('/jobs/employer/myjobs');
export const toggleJobStatus = (id) => API.patch(`/jobs/${id}/toggle`);
export const saveJob = (id) => API.post(`/jobs/${id}/save`);
export const getSavedJobs = () => API.get('/jobs/saved/all');

// ─── Applications ────────────────────────────────────────────────────────────
export const applyToJob = (jobId, data) => API.post(`/applications/jobs/${jobId}/apply`, data);
export const getMyApplications = () => API.get('/applications/my');
export const getJobApplications = (jobId) => API.get(`/applications/jobs/${jobId}`);
export const updateApplicationStatus = (applicationId, data) =>
  API.patch(`/applications/${applicationId}/status`, data);
export const getApplicationStats = () => API.get('/applications/stats');

// ─── Admin ───────────────────────────────────────────────────────────────────
export const getAllUsers = () => API.get('/admin/users');
export const toggleUserStatus = (id) => API.patch(`/admin/users/${id}/toggle`);
export const getPlatformStats = () => API.get('/admin/stats');
export const getAllJobs = () => API.get('/admin/jobs');

export default API;
