import { useState, useEffect } from 'react';
import { useAuthStore } from '../context/authStore';
import { useNavigate, Link } from 'react-router-dom';

export default function Dashboard() {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [postedJobs, setPostedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      // Fetch applications for job seekers
      if (user?.role === 'jobseeker') {
        const appResponse = await fetch('/api/applications', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (appResponse.ok) {
          const appData = await appResponse.json();
          setApplications(appData.applications || []);
        }
      }
      
      // Fetch posted jobs for admin
      if (user?.role === 'admin') {
        const jobResponse = await fetch('/api/jobs', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (jobResponse.ok) {
          const jobData = await jobResponse.json();
          setPostedJobs(jobData.jobs || []);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container" style={{ padding: 'var(--space-xl) var(--space-md)' }}>
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <h1 className="mb-2">Dashboard</h1>
        <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
          Welcome back, <strong>{user?.name}</strong>! 👋
        </p>
      </div>

      {/* User Info Card */}
      <div style={{ background: 'white', padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', marginBottom: 'var(--space-lg)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-lg)' }}>
          <div>
            <p style={{ color: 'var(--text-light)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Role</p>
            <p style={{ fontSize: '1.1rem', fontWeight: 600, textTransform: 'capitalize' }}>
              {user?.role === 'jobseeker' ? '🔍 Job Seeker' : '⚙️ Admin'}
            </p>
          </div>
          <div>
            <p style={{ color: 'var(--text-light)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Email</p>
            <p style={{ fontSize: '1rem' }}>{user?.email}</p>
          </div>
          {user?.company && (
            <div>
              <p style={{ color: 'var(--text-light)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Company</p>
              <p style={{ fontSize: '1rem', fontWeight: 500 }}>{user.company}</p>
            </div>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)', borderBottom: '2px solid #eee', paddingBottom: 'var(--space-md)' }}>
        <button
          onClick={() => setActiveTab('overview')}
          style={{
            padding: 'var(--space-sm) var(--space-md)',
            border: 'none',
            background: activeTab === 'overview' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'overview' ? 'white' : 'var(--text)',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontWeight: 500,
            fontSize: '1rem'
          }}
        >
          Overview
        </button>
        {user?.role === 'jobseeker' && (
          <button
            onClick={() => setActiveTab('applications')}
            style={{
              padding: 'var(--space-sm) var(--space-md)',
              border: 'none',
              background: activeTab === 'applications' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'applications' ? 'white' : 'var(--text)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '1rem'
            }}
          >
            My Applications ({applications.length})
          </button>
        )}
        {user?.role === 'admin' && (
          <button
            onClick={() => setActiveTab('jobs')}
            style={{
              padding: 'var(--space-sm) var(--space-md)',
              border: 'none',
              background: activeTab === 'jobs' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'jobs' ? 'white' : 'var(--text)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '1rem'
            }}
          >
            Posted Jobs ({postedJobs.length})
          </button>
        )}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-lg)' }}>
          {user?.role === 'jobseeker' ? (
            <>
              {/* Job Seeker Cards */}
              <div style={{ background: 'white', padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>📋</div>
                <h3>My Applications</h3>
                <p style={{ color: 'var(--text-light)', marginTop: 'var(--space-sm)' }}>
                  <strong style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>{applications.length}</strong> applications submitted
                </p>
                <Link to="#" onClick={() => setActiveTab('applications')} style={{ color: 'var(--primary)', fontWeight: 500, marginTop: 'var(--space-md)', display: 'inline-block' }}>
                  View all →
                </Link>
              </div>

              <div style={{ background: 'white', padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>💼</div>
                <h3>Browse Jobs</h3>
                <p style={{ color: 'var(--text-light)', marginTop: 'var(--space-sm)' }}>
                  Find your next opportunity
                </p>
                <Link to="/jobs" style={{ color: 'var(--primary)', fontWeight: 500, marginTop: 'var(--space-md)', display: 'inline-block' }}>
                  View all jobs →
                </Link>
              </div>

              <div style={{ background: 'white', padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>👤</div>
                <h3>Profile</h3>
                <p style={{ color: 'var(--text-light)', marginTop: 'var(--space-sm)' }}>
                  Update your information
                </p>
                <Link to="/profile" style={{ color: 'var(--primary)', fontWeight: 500, marginTop: 'var(--space-md)', display: 'inline-block' }}>
                  Edit profile →
                </Link>
              </div>
            </>
          ) : (
            <>
              {/* Admin Cards */}
              <div style={{ background: 'white', padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>📝</div>
                <h3>Posted Jobs</h3>
                <p style={{ color: 'var(--text-light)', marginTop: 'var(--space-sm)' }}>
                  <strong style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>{postedJobs.length}</strong> jobs posted
                </p>
                <Link to="#" onClick={() => setActiveTab('jobs')} style={{ color: 'var(--primary)', fontWeight: 500, marginTop: 'var(--space-md)', display: 'inline-block' }}>
                  Manage jobs →
                </Link>
              </div>

              <div style={{ background: 'white', padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>➕</div>
                <h3>Post a New Job</h3>
                <p style={{ color: 'var(--text-light)', marginTop: 'var(--space-sm)' }}>
                  Add a job opening
                </p>
                <Link to="/post-job" style={{ color: 'var(--primary)', fontWeight: 500, marginTop: 'var(--space-md)', display: 'inline-block' }}>
                  Post job →
                </Link>
              </div>

              <div style={{ background: 'white', padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>👥</div>
                <h3>Applications</h3>
                <p style={{ color: 'var(--text-light)', marginTop: 'var(--space-sm)' }}>
                  Review applications
                </p>
                <button style={{ color: 'var(--primary)', fontWeight: 500, marginTop: 'var(--space-md)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>
                  View all →
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Applications Tab - Job Seekers */}
      {activeTab === 'applications' && user?.role === 'jobseeker' && (
        <div style={{ background: 'white', padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
          {applications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-light)', marginBottom: 'var(--space-md)' }}>
                No applications yet
              </p>
              <Link to="/jobs" className="btn btn-primary">
                Browse Jobs
              </Link>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #eee' }}>
                    <th style={{ textAlign: 'left', padding: 'var(--space-md)', fontWeight: 600 }}>Job Title</th>
                    <th style={{ textAlign: 'left', padding: 'var(--space-md)', fontWeight: 600 }}>Company</th>
                    <th style={{ textAlign: 'left', padding: 'var(--space-md)', fontWeight: 600 }}>Status</th>
                    <th style={{ textAlign: 'left', padding: 'var(--space-md)', fontWeight: 600 }}>Applied Date</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app._id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: 'var(--space-md)' }}>
                        <strong>{app.jobId?.title}</strong>
                      </td>
                      <td style={{ padding: 'var(--space-md)' }}>
                        {app.jobId?.company}
                      </td>
                      <td style={{ padding: 'var(--space-md)' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          background: app.status === 'pending' ? '#fff3cd' : app.status === 'accepted' ? '#d4edda' : '#f8d7da',
                          color: app.status === 'pending' ? '#856404' : app.status === 'accepted' ? '#155724' : '#721c24'
                        }}>
                          {app.status}
                        </span>
                      </td>
                      <td style={{ padding: 'var(--space-md)', color: 'var(--text-light)' }}>
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Jobs Tab - Admin */}
      {activeTab === 'jobs' && user?.role === 'admin' && (
        <div>
          {postedJobs.length === 0 ? (
            <div style={{ background: 'white', padding: 'var(--space-xl)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-light)', marginBottom: 'var(--space-md)' }}>
                No jobs posted yet
              </p>
              <Link to="/post-job" className="btn btn-primary">
                Post Your First Job
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 'var(--space-lg)' }}>
              {postedJobs.map((job) => (
                <div key={job._id} style={{ background: 'white', padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', borderLeft: '4px solid var(--primary)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 'var(--space-lg)', alignItems: 'start' }}>
                    <div style={{ fontSize: '2rem' }}>💼</div>
                    <div>
                      <h3 style={{ marginBottom: '0.25rem' }}>{job.title}</h3>
                      <p style={{ color: 'var(--text-light)', marginBottom: 'var(--space-sm)' }}>
                        {job.company} • {job.location}
                      </p>
                      <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', marginBottom: 'var(--space-sm)' }}>
                        <span style={{ background: '#e7f3ff', color: '#0066cc', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem' }}>
                          {job.jobType}
                        </span>
                        <span style={{ background: '#f0f0f0', color: '#333', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem' }}>
                          {job.salaryMin ? `R${job.salaryMin.toLocaleString()}` : 'Salary TBD'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-sm)' }}>
                        <button style={{ padding: '0.5rem 1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 500 }}>
                          View Applications
                        </button>
                        <button style={{ padding: '0.5rem 1rem', background: '#f0f0f0', color: '#333', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 500 }}>
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
