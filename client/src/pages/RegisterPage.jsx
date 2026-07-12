import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LuUser,
  LuMail,
  LuLock,
  LuEye,
  LuEyeOff,
  LuBuilding2,
  LuBriefcase,
  LuUsers,
  LuArrowLeft,
  LuArrowRight,
  LuSearch,
} from 'react-icons/lu';
import toast from 'react-hot-toast';

const industries = [
  'Technology', 'Finance', 'Healthcare', 'Education', 'Marketing',
  'Engineering', 'Legal', 'Design', 'Retail', 'Other',
];

const RegisterPage = () => {
  const { register, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    industry: '',
    companySize: '',
  });

  useEffect(() => {
    if (user && !authLoading) {
      navigate('/dashboard');
    }
  }, [user, authLoading, navigate]);

  const totalSteps = role === 'employer' ? 3 : 2;

  const validateStep = (currentStep) => {
    const errs = {};
    if (currentStep >= 1) {
      if (!role) errs.role = 'Please select a role';
    }
    if (currentStep >= 2) {
      if (!form.name.trim()) errs.name = 'Name is required';
      if (!form.email.trim()) errs.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
      if (!form.password) errs.password = 'Password is required';
      else if (form.password.length < 6) errs.password = 'Minimum 6 characters';
      if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    }
    if (currentStep >= 3 && role === 'employer') {
      if (!form.companyName.trim()) errs.companyName = 'Company name is required';
    }
    return errs;
  };

  const handleNext = () => {
    const errs = validateStep(step);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setStep(step + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < totalSteps) {
      handleNext();
      return;
    }

    const errs = validateStep(step);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role,
      };
      if (role === 'employer') {
        payload.companyName = form.companyName;
        payload.industry = form.industry;
        payload.companySize = form.companySize;
      }
      await register(payload);
      navigate('/dashboard');
    } catch (err) {
      const rawMsg = err.response?.data?.message || err.response?.data?.error || 'Registration failed';
      const msg = Array.isArray(rawMsg)
        ? rawMsg.join(', ')
        : (typeof rawMsg === 'object' ? (rawMsg.message || JSON.stringify(rawMsg)) : rawMsg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="page-loading">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-bg-shapes">
        <div className="shape shape-1" />
        <div className="shape shape-2" />
      </div>
      <div className="auth-card glass-card register-card">
        <div className="auth-header">
          <div className="auth-logo">
            <LuBriefcase size={28} />
          </div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join JobPortal and start your journey</p>
        </div>

        {/* Progress */}
        <div className="register-progress">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div key={i} className={`progress-step ${step > i ? 'completed' : ''} ${step === i + 1 ? 'active' : ''}`}>
              <div className="progress-dot">{i + 1}</div>
              {i < totalSteps - 1 && <div className="progress-line" />}
            </div>
          ))}
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Step 1: Role */}
          {step === 1 && (
            <div className="role-selection">
              <div
                className={`role-card glass-card ${role === 'seeker' ? 'selected' : ''}`}
                onClick={() => { setRole('seeker'); setErrors({}); }}
              >
                <LuSearch size={36} />
                <h3>Job Seeker</h3>
                <p>Find your dream job and apply to top companies</p>
              </div>
              <div
                className={`role-card glass-card ${role === 'employer' ? 'selected' : ''}`}
                onClick={() => { setRole('employer'); setErrors({}); }}
              >
                <LuBuilding2 size={36} />
                <h3>Employer</h3>
                <p>Post jobs and find the best talent for your team</p>
              </div>
              {errors.role && <span className="form-error center">{errors.role}</span>}
            </div>
          )}

          {/* Step 2: User info */}
          {step === 2 && (
            <>
              <div className={`form-group ${errors.name ? 'error' : ''}`}>
                <label>Full Name</label>
                <div className="input-icon-wrapper">
                  <LuUser size={18} className="input-icon" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>
              <div className={`form-group ${errors.email ? 'error' : ''}`}>
                <label>Email Address</label>
                <div className="input-icon-wrapper">
                  <LuMail size={18} className="input-icon" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>
              <div className={`form-group ${errors.password ? 'error' : ''}`}>
                <label>Password</label>
                <div className="input-icon-wrapper">
                  <LuLock size={18} className="input-icon" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                  <button type="button" className="input-icon-right" onClick={() => setShowPw(!showPw)}>
                    {showPw ? <LuEyeOff size={18} /> : <LuEye size={18} />}
                  </button>
                </div>
                {errors.password && <span className="form-error">{errors.password}</span>}
              </div>
              <div className={`form-group ${errors.confirmPassword ? 'error' : ''}`}>
                <label>Confirm Password</label>
                <div className="input-icon-wrapper">
                  <LuLock size={18} className="input-icon" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  />
                  <button type="button" className="input-icon-right" onClick={() => setShowConfirm(!showConfirm)}>
                    {showConfirm ? <LuEyeOff size={18} /> : <LuEye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
              </div>
            </>
          )}

          {/* Step 3: Employer info */}
          {step === 3 && role === 'employer' && (
            <>
              <div className={`form-group ${errors.companyName ? 'error' : ''}`}>
                <label>Company Name</label>
                <div className="input-icon-wrapper">
                  <LuBuilding2 size={18} className="input-icon" />
                  <input
                    type="text"
                    placeholder="Acme Inc."
                    value={form.companyName}
                    onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  />
                </div>
                {errors.companyName && <span className="form-error">{errors.companyName}</span>}
              </div>
              <div className="form-group">
                <label>Industry</label>
                <select
                  className="filter-select"
                  value={form.industry}
                  onChange={(e) => setForm({ ...form, industry: e.target.value })}
                >
                  <option value="">Select industry</option>
                  {industries.map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Company Size</label>
                <div className="input-icon-wrapper">
                  <LuUsers size={18} className="input-icon" />
                  <input
                    type="text"
                    placeholder="e.g. 50-200"
                    value={form.companySize}
                    onChange={(e) => setForm({ ...form, companySize: e.target.value })}
                  />
                </div>
              </div>
            </>
          )}

          <div className="auth-actions">
            {step > 1 && (
              <button type="button" className="btn btn-outline" onClick={() => setStep(step - 1)}>
                <LuArrowLeft size={16} /> Back
              </button>
            )}
            {step < totalSteps ? (
              <button type="button" className="btn btn-primary" onClick={handleNext}>
                Next <LuArrowRight size={16} />
              </button>
            ) : (
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                {loading ? <span className="spinner-sm" /> : 'Create Account'}
              </button>
            )}
          </div>
        </form>

        <p className="auth-footer-text">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
