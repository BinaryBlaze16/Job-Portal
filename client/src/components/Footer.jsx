import { Link } from 'react-router-dom';
import { LuBriefcase, LuTwitter, LuLinkedin, LuGithub, LuMail } from 'react-icons/lu';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-col">
            <Link to="/" className="footer-logo">
              <LuBriefcase size={22} />
              <span className="gradient-text">JobPortal</span>
            </Link>
            <p className="footer-description">
              Your gateway to finding the perfect career opportunity. We connect talented
              professionals with top companies worldwide.
            </p>
            <div className="footer-socials">
              <a href="#" className="social-link" aria-label="Twitter"><LuTwitter size={18} /></a>
              <a href="#" className="social-link" aria-label="LinkedIn"><LuLinkedin size={18} /></a>
              <a href="#" className="social-link" aria-label="GitHub"><LuGithub size={18} /></a>
              <a href="#" className="social-link" aria-label="Email"><LuMail size={18} /></a>
            </div>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">For Job Seekers</h4>
            <ul className="footer-list">
              <li><Link to="/jobs">Browse Jobs</Link></li>
              <li><Link to="/register">Create Account</Link></li>
              <li><Link to="/dashboard">My Applications</Link></li>
              <li><Link to="/dashboard">Saved Jobs</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">For Employers</h4>
            <ul className="footer-list">
              <li><Link to="/register">Post a Job</Link></li>
              <li><Link to="/dashboard">Manage Listings</Link></li>
              <li><Link to="/dashboard">View Applicants</Link></li>
              <li><Link to="/register">Create Account</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Contact</h4>
            <ul className="footer-list">
              <li><a href="mailto:support@jobportal.com">support@jobportal.com</a></li>
              <li><a href="tel:+1234567890">+1 (234) 567-890</a></li>
              <li><span>123 Innovation Drive</span></li>
              <li><span>San Francisco, CA 94105</span></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} JobPortal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
