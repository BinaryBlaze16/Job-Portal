import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LuSearch,
  LuMapPin,
  LuBriefcase,
  LuUsers,
  LuTrendingUp,
  LuCode,
  LuPalette,
  LuMegaphone,
  LuDollarSign,
  LuCpu,
  LuHeart,
  LuArrowRight,
  LuUserPlus,
  LuFileSearch,
  LuPartyPopper,
} from 'react-icons/lu';
import JobCard from '../components/JobCard';
import AnimatedCounter from '../components/AnimatedCounter';
import Footer from '../components/Footer';
import { getJobs } from '../services/api';

const LandingPage = () => {
  const navigate = useNavigate();
  const [searchTitle, setSearchTitle] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await getJobs({ limit: 6, sort: '-createdAt' });
        setFeaturedJobs(data.jobs || data.data || data || []);
      } catch {
        setFeaturedJobs([]);
      } finally {
        setLoadingJobs(false);
      }
    };
    fetchJobs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTitle) params.set('search', searchTitle);
    if (searchLocation) params.set('location', searchLocation);
    navigate(`/jobs?${params.toString()}`);
  };

  const stats = [
    { icon: <LuBriefcase size={28} />, value: 10000, suffix: '+', label: 'Jobs Posted' },
    { icon: <LuUsers size={28} />, value: 5000, suffix: '+', label: 'Companies' },
    { icon: <LuUserPlus size={28} />, value: 50000, suffix: '+', label: 'Candidates' },
    { icon: <LuTrendingUp size={28} />, value: 95, suffix: '%', label: 'Success Rate' },
  ];

  const steps = [
    { icon: <LuUserPlus size={32} />, title: 'Create Profile', desc: 'Sign up and build your professional profile in minutes.' },
    { icon: <LuFileSearch size={32} />, title: 'Search Jobs', desc: 'Browse thousands of opportunities matching your skills.' },
    { icon: <LuPartyPopper size={32} />, title: 'Get Hired', desc: 'Apply, interview, and land your dream position.' },
  ];

  const categories = [
    { icon: <LuCode size={28} />, name: 'Technology', count: '2,500+' },
    { icon: <LuPalette size={28} />, name: 'Design', count: '1,200+' },
    { icon: <LuMegaphone size={28} />, name: 'Marketing', count: '800+' },
    { icon: <LuDollarSign size={28} />, name: 'Finance', count: '1,500+' },
    { icon: <LuCpu size={28} />, name: 'Engineering', count: '2,000+' },
    { icon: <LuHeart size={28} />, name: 'Healthcare', count: '900+' },
  ];

  return (
    <div className="landing-page">
      {/* ──────── Hero ──────── */}
      <section className="hero">
        <div className="hero-bg-shapes">
          <div className="shape shape-1" />
          <div className="shape shape-2" />
          <div className="shape shape-3" />
          <div className="shape shape-4" />
          <div className="shape shape-5" />
        </div>
        <div className="hero-content">
          <h1 className="hero-title">
            Find Your <span className="gradient-text">Dream Job</span> Today
          </h1>
          <p className="hero-subtitle">
            Connect with top employers and opportunities worldwide. Your next career move starts here.
          </p>
          <form className="hero-search" onSubmit={handleSearch}>
            <div className="hero-search-field">
              <LuSearch size={20} className="hero-search-icon" />
              <input
                type="text"
                placeholder="Job title, keyword, or company..."
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
              />
            </div>
            <div className="hero-search-field">
              <LuMapPin size={20} className="hero-search-icon" />
              <input
                type="text"
                placeholder="City or Remote..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-lg hero-search-btn">
              Search Jobs
            </button>
          </form>
        </div>
      </section>

      {/* ──────── Stats ──────── */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((s, i) => (
              <div key={i} className="stat-card glass-card">
                <div className="stat-icon">{s.icon}</div>
                <div className="stat-value">
                  <AnimatedCounter end={s.value} suffix={s.suffix} />
                </div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── Featured Jobs ──────── */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              Featured <span className="gradient-text">Jobs</span>
            </h2>
            <p className="section-subtitle">Discover the latest opportunities from top companies</p>
          </div>
          {loadingJobs ? (
            <div className="jobs-grid">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-row">
                    <div className="skeleton-circle" />
                    <div className="skeleton-lines">
                      <div className="skeleton-line w-60" />
                      <div className="skeleton-line w-40" />
                    </div>
                  </div>
                  <div className="skeleton-line w-80" />
                  <div className="skeleton-line w-50" />
                  <div className="skeleton-row mt">
                    <div className="skeleton-badge" />
                    <div className="skeleton-badge" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredJobs.length > 0 ? (
            <div className="jobs-grid">
              {featuredJobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <LuBriefcase size={48} />
              <p>No jobs available right now. Check back soon!</p>
            </div>
          )}
          <div className="section-cta">
            <Link to="/jobs" className="btn btn-outline">
              View All Jobs <LuArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ──────── How It Works ──────── */}
      <section className="how-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="section-subtitle">Three simple steps to your new career</p>
          </div>
          <div className="how-grid">
            {steps.map((step, i) => (
              <div key={i} className="how-card glass-card">
                <div className="how-step-number">{i + 1}</div>
                <div className="how-icon">{step.icon}</div>
                <h3 className="how-title">{step.title}</h3>
                <p className="how-desc">{step.desc}</p>
                {i < steps.length - 1 && <div className="how-connector" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── Top Categories ──────── */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              Top <span className="gradient-text">Categories</span>
            </h2>
            <p className="section-subtitle">Explore jobs by industry</p>
          </div>
          <div className="categories-grid">
            {categories.map((cat, i) => (
              <Link
                key={i}
                to={`/jobs?category=${cat.name}`}
                className="category-card glass-card"
              >
                <div className="category-icon">{cat.icon}</div>
                <h3 className="category-name">{cat.name}</h3>
                <p className="category-count">{cat.count} jobs</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── CTA ──────── */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Get Started?</h2>
            <p className="cta-subtitle">
              Join thousands of professionals finding their dream careers every day.
            </p>
            <div className="cta-buttons">
              <Link to="/jobs" className="btn btn-primary btn-lg">Find Jobs</Link>
              <Link to="/register" className="btn btn-outline btn-lg">Post a Job</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
