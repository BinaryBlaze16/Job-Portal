import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LuMenu,
  LuX,
  LuBriefcase,
  LuUser,
  LuLogOut,
  LuLayoutDashboard,
  LuChevronDown,
} from 'react-icons/lu';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  const dashboardLabel = () => {
    if (!user) return null;
    if (user.role === 'admin') return 'Admin Panel';
    if (user.role === 'employer') return 'Employer Dashboard';
    return 'My Dashboard';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={() => setMobileOpen(false)}>
          <LuBriefcase size={24} />
          <span className="gradient-text">JobPortal</span>
        </Link>

        <div className={`navbar-links ${mobileOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setMobileOpen(false)}>Home</Link>
          <Link to="/jobs" className="nav-link" onClick={() => setMobileOpen(false)}>Jobs</Link>
          {user && (
            <Link to="/dashboard" className="nav-link" onClick={() => setMobileOpen(false)}>
              {dashboardLabel()}
            </Link>
          )}

          {!user ? (
            <div className="nav-auth-mobile">
              <Link to="/login" className="btn btn-outline" onClick={() => setMobileOpen(false)}>Login</Link>
              <Link to="/register" className="btn btn-primary" onClick={() => setMobileOpen(false)}>Register</Link>
            </div>
          ) : (
            <div className="nav-auth-mobile">
              <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>

        <div className="navbar-right">
          {!user ? (
            <div className="nav-auth-desktop">
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </div>
          ) : (
            <div className="nav-user-dropdown" ref={dropdownRef}>
              <button className="nav-user-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <div className="nav-avatar">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="nav-user-name">{user.name}</span>
                <LuChevronDown size={16} className={`dropdown-chevron ${dropdownOpen ? 'rotated' : ''}`} />
              </button>
              {dropdownOpen && (
                <div className="nav-dropdown-menu">
                  <Link to="/dashboard" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <LuLayoutDashboard size={16} /> Dashboard
                  </Link>
                  <Link to="/dashboard?tab=profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <LuUser size={16} /> Profile
                  </Link>
                  <button className="dropdown-item danger" onClick={handleLogout}>
                    <LuLogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <LuX size={24} /> : <LuMenu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />}
    </nav>
  );
};

export default Navbar;
