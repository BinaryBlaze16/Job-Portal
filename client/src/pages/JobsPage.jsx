import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LuArrowUpDown, LuLayoutGrid, LuList, LuBriefcase } from 'react-icons/lu';
import JobCard from '../components/JobCard';
import JobFilters from '../components/JobFilters';
import LoadingSkeleton from '../components/LoadingSkeleton';
import Footer from '../components/Footer';
import { getJobs } from '../services/api';

const JobsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState('-createdAt');
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || '',
    category: searchParams.get('category') || '',
    jobType: [],
    experience: [],
    salaryMin: '',
    salaryMax: '',
  });

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, sort, limit: 12 };
      if (filters.search) params.search = filters.search;
      if (filters.location) params.location = filters.location;
      if (filters.category) params.category = filters.category;
      if (filters.jobType?.length) params.jobType = filters.jobType.join(',');
      if (filters.experience?.length) params.experience = filters.experience.join(',');
      if (filters.salaryMin) params.salaryMin = filters.salaryMin;
      if (filters.salaryMax) params.salaryMax = filters.salaryMax;

      const { data } = await getJobs(params);
      const jobList = data.jobs || data.data || data || [];
      setJobs(Array.isArray(jobList) ? jobList : []);
      setTotalJobs(data.total || data.totalJobs || jobList.length);
      setTotalPages(data.totalPages || data.pages || Math.ceil((data.total || jobList.length) / 12) || 1);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [page, sort, filters]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleClear = () => {
    setFilters({ search: '', location: '', category: '', jobType: [], experience: [], salaryMin: '', salaryMax: '' });
    setSearchParams({});
    setPage(1);
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = pages.filter(
    (p) => p === 1 || p === totalPages || (p >= page - 2 && p <= page + 2)
  );

  return (
    <div className="jobs-page">
      <div className="jobs-page-container">
        <JobFilters filters={filters} onChange={handleFilterChange} onClear={handleClear} />

        <main className="jobs-main">
          <div className="jobs-toolbar">
            <span className="jobs-count">
              {loading ? 'Searching...' : `${totalJobs} job${totalJobs !== 1 ? 's' : ''} found`}
            </span>
            <div className="jobs-toolbar-right">
              <div className="sort-select-wrapper">
                <LuArrowUpDown size={14} />
                <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }} className="sort-select">
                  <option value="-createdAt">Newest First</option>
                  <option value="createdAt">Oldest First</option>
                  <option value="-salaryMax">Salary High–Low</option>
                  <option value="salaryMin">Salary Low–High</option>
                </select>
              </div>
              <div className="view-toggle">
                <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')}>
                  <LuLayoutGrid size={18} />
                </button>
                <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}>
                  <LuList size={18} />
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="jobs-grid">
              <LoadingSkeleton variant="card" count={6} />
            </div>
          ) : jobs.length > 0 ? (
            <div className={viewMode === 'grid' ? 'jobs-grid' : 'jobs-list'}>
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <LuBriefcase size={56} />
              <h3>No Jobs Found</h3>
              <p>Try adjusting your filters or search terms</p>
              <button className="btn btn-outline" onClick={handleClear}>Clear Filters</button>
            </div>
          )}

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>
              {visiblePages.map((p, i) => {
                const prevPage = visiblePages[i - 1];
                return (
                  <span key={p}>
                    {prevPage && p - prevPage > 1 && <span className="pagination-ellipsis">...</span>}
                    <button
                      className={`pagination-btn ${page === p ? 'active' : ''}`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  </span>
                );
              })}
              <button
                className="pagination-btn"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default JobsPage;
