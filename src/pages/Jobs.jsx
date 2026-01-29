import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { jobsAPI } from '../utils/api';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    jobType: '',
    category: '',
    location: ''
  });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setFilters(prev => ({ ...prev, search: searchQuery }));
    }
  }, [searchParams]);

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.jobType) params.jobType = filters.jobType;
      if (filters.category) params.category = filters.category;
      if (filters.location) params.location = filters.location;

      const response = await jobsAPI.getAll(params);
      setJobs(response.data.jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Remote', 'Internship'];
  const categories = ['Technology', 'Marketing', 'Sales', 'Design', 'Finance', 'Healthcare', 'Education', 'Engineering', 'Other'];

  return (
    <div>
      <section style={{ background: 'var(--bg-white)', padding: 'var(--space-lg) 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <h1 style={{ marginBottom: 'var(--space-md)' }}>Find Your Dream Job</h1>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-md)' }}>
            <input
              type="text"
              placeholder="Search jobs..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              style={{ padding: '0.75rem', border: '2px solid var(--border)', borderRadius: 'var(--radius-md)' }}
            />
            
            <select
              value={filters.jobType}
              onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
              style={{ padding: '0.75rem', border: '2px solid var(--border)', borderRadius: 'var(--radius-md)' }}
            >
              <option value="">All Job Types</option>
              {jobTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              style={{ padding: '0.75rem', border: '2px solid var(--border)', borderRadius: 'var(--radius-md)' }}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Location..."
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              style={{ padding: '0.75rem', border: '2px solid var(--border)', borderRadius: 'var(--radius-md)' }}
            />
          </div>
        </div>
      </section>

      <section className="jobs-section">
        <div className="container">
          {loading ? (
            <div className="loading">Loading jobs...</div>
          ) : jobs.length === 0 ? (
            <div className="empty-state">
              <h3>No jobs found</h3>
              <p style={{ color: 'var(--text-light)' }}>Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <p style={{ color: 'var(--text-light)', marginBottom: 'var(--space-lg)' }}>
                Found {jobs.length} jobs
              </p>
              
              <div className="jobs-grid">
                {jobs.map((job) => (
                  <div key={job._id} className="job-card" onClick={() => navigate(`/jobs/${job._id}`)}>
                    <div className="job-header">
                      <div>
                        <h3>{job.title}</h3>
                        <div className="company-name">
                          🏢 {job.company}
                        </div>
                      </div>
                    </div>

                    <div className="job-tags">
                      <span className="tag primary">{job.jobType}</span>
                      <span className="tag">📍 {job.location}</span>
                      <span className="tag">{job.category}</span>
                      {job.experienceLevel && (
                        <span className="tag">{job.experienceLevel}</span>
                      )}
                    </div>

                    <p className="job-description">
                      {job.description.substring(0, 150)}...
                    </p>

                    <div className="job-footer">
                      {job.salaryMin && job.salaryMax && (
                        <span className="salary">
                          ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
                        </span>
                      )}
                      <span style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>
                        {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
