import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jobsAPI } from '../utils/api';

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLatestJobs();
  }, []);

  const fetchLatestJobs = async () => {
    try {
      const response = await jobsAPI.getAll({ limit: 6 });
      setJobs(response.data.jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?search=${searchQuery}`);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Find Your Next Great Opportunity</h1>
            <p>Connect with top employers and discover jobs that match your passion and skills</p>
            
            <form onSubmit={handleSearch} className="search-bar">
              <input
                type="text"
                placeholder="Search by job title, company, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">
                Search Jobs
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Latest Jobs */}
      <section className="jobs-section">
        <div className="container">
          <div className="section-header">
            <h2>Latest Opportunities</h2>
            <p style={{ color: 'var(--text-light)', marginTop: 'var(--space-sm)' }}>
              Explore the newest job postings from top companies
            </p>
          </div>

          {loading ? (
            <div className="loading">Loading amazing opportunities...</div>
          ) : (
            <>
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

              <div className="text-center mt-3">
                <Link to="/jobs" className="btn btn-primary">
                  View All Jobs →
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
        color: 'white',
        padding: 'var(--space-2xl) 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <h2 style={{ color: 'white', marginBottom: 'var(--space-md)' }}>
            Ready to Get Started?
          </h2>
          <p style={{ fontSize: '1.125rem', marginBottom: 'var(--space-lg)', opacity: 0.95 }}>
            Join thousands of job seekers and employers finding their perfect match
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn" style={{ background: 'white', color: 'var(--primary)' }}>
              Create Account
            </Link>
            <Link to="/jobs" className="btn btn-secondary" style={{ borderColor: 'white', color: 'white' }}>
              Browse Jobs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
