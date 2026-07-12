import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LuMail, LuLock, LuEye, LuEyeOff, LuBriefcase } from 'react-icons/lu';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const { login, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user && !authLoading) {
      navigate('/dashboard');
    }
  }, [user, authLoading, navigate]);

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email address';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      const rawMsg = err.response?.data?.message || err.response?.data?.error || 'Login failed';
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
      <div className="auth-card glass-card">
        <div className="auth-header">
          <div className="auth-logo">
            <LuBriefcase size={28} />
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your account to continue</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className={`form-group ${errors.email ? 'error' : ''}`}>
            <label htmlFor="email">Email Address</label>
            <div className="input-icon-wrapper">
              <LuMail size={18} className="input-icon" />
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className={`form-group ${errors.password ? 'error' : ''}`}>
            <label htmlFor="password">Password</label>
            <div className="input-icon-wrapper">
              <LuLock size={18} className="input-icon" />
              <input
                id="password"
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

          <div className="form-row">
            <label className="filter-checkbox">
              <input type="checkbox" checked={remember} onChange={() => setRemember(!remember)} />
              <span className="checkmark" />
              <span>Remember me</span>
            </label>
          </div>

          <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
            {loading ? <span className="spinner-sm" /> : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer-text">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="auth-link">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
