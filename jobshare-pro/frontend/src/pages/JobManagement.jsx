import { useState, useEffect } from 'react';
import { useAuthStore } from '../context/authStore';
import { useNavigate } from 'react-router-dom';
import { jobsAPI } from '../utils/api';

export default function JobManagement() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [viewingApplications, setViewingApplications] = useState(null);
  const [jobApplications, setJobApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if not admin
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchJobs();
  }, [isAuthenticated, user]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/jobs/my/posted', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs || []);
      }
    } catch (err) {
      setError('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) {
      return;
    }

    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        alert('✅ Job deleted successfully!');
        setJobs(jobs.filter(job => job._id !== jobId));
        setSelectedJob(null);
      } else {
        const data = await response.json();
        alert(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      alert('Error deleting job');
    }
  };

  const handleEditJob = async (jobData) => {
    try {
      const response = await fetch(`/api/jobs/${editingJob._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(jobData)
      });

      if (response.ok) {
        alert('✅ Job updated successfully!');
        setEditingJob(null);
        fetchJobs();
      } else {
        const data = await response.json();
        alert(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      alert('Error updating job');
    }
  };

  const fetchJobApplications = async (jobId) => {
    try {
      setApplicationsLoading(true);
      const response = await fetch(`/api/applications?jobId=${jobId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setJobApplications(data.applications || []);
        setViewingApplications(jobId);
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
      alert('Error loading applications');
    } finally {
      setApplicationsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: 'var(--space-xl) var(--space-md)', textAlign: 'center' }}>
        <p>Loading your jobs...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: 'var(--space-xl) var(--space-md)', maxWidth: '1200px' }}>
      <h1 className="mb-2">My Posted Jobs</h1>
      <p style={{ color: 'var(--text-light)', marginBottom: 'var(--space-lg)' }}>
        View, edit, and manage your job postings
      </p>

      {error && (
        <div style={{ background: 'rgba(239, 71, 111, 0.1)', color: 'var(--error)', padding: 'var(--space-md)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-lg)' }}>
          {error}
        </div>
      )}

      {jobs.length === 0 ? (
        <div style={{ background: 'white', padding: 'var(--space-xl)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-light)', fontSize: '1.1rem', marginBottom: 'var(--space-lg)' }}>
            You haven't posted any jobs yet
          </p>
          <button onClick={() => navigate('/post-job')} className="btn btn-primary">
            Post Your First Job
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 'var(--space-lg)' }}>
          {jobs.map(job => (
            <div
              key={job._id}
              style={{
                background: 'white',
                padding: 'var(--space-lg)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-sm)',
                border: selectedJob?._id === job._id ? '2px solid var(--primary)' : '1px solid #eee',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedJob(job)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--space-md)' }}>
                <div>
                  <h3 style={{ marginBottom: '0.25rem', marginTop: 0 }}>{job.title}</h3>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', margin: 0 }}>
                    {job.company}
                  </p>
                </div>
                <span
                  style={{
                    background: job.status === 'active' ? '#d4edda' : '#f8d7da',
                    color: job.status === 'active' ? '#155724' : '#721c24',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    textTransform: 'capitalize',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {job.status}
                </span>
              </div>

              <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: 'var(--space-sm)' }}>
                <strong>Location:</strong> {job.location}
              </p>
              <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: 'var(--space-sm)' }}>
                <strong>Type:</strong> {job.jobType}
              </p>
              {job.salaryMin && (
                <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: 'var(--space-md)' }}>
                  <strong>Salary:</strong> R{job.salaryMin.toLocaleString()} - R{job.salaryMax.toLocaleString()}
                </p>
              )}

              <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingJob(job);
                  }}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '0.5rem 1rem' }}
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    fetchJobApplications(job._id);
                  }}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '0.5rem 1rem', background: '#17a2b8' }}
                >
                  Applications
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteJob(job._id);
                  }}
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: '0.5rem 1rem', background: '#f8d7da', color: '#721c24', border: 'none' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Job Modal */}
      {editingJob && (
        <EditJobModal
          job={editingJob}
          onClose={() => setEditingJob(null)}
          onSave={handleEditJob}
        />
      )}

      {/* View Applications Modal */}
      {viewingApplications && (
        <ApplicationsModal
          jobId={viewingApplications}
          applications={jobApplications}
          loading={applicationsLoading}
          onClose={() => setViewingApplications(null)}
        />
      )}
    </div>
  );
}

function EditJobModal({ job, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: job.title,
    company: job.company,
    description: job.description,
    location: job.location,
    jobType: job.jobType,
    category: job.category,
    salaryMin: job.salaryMin || '',
    salaryMax: job.salaryMax || '',
    experienceLevel: job.experienceLevel || 'Mid',
    status: job.status || 'active'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 'var(--space-lg)'
    }} onClick={onClose}>
      <div style={{
        background: 'white',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-xl)',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflow: 'auto',
        width: '100%'
      }} onClick={(e) => e.stopPropagation()}>
        <h2>Edit Job</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Job Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Company</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="6"
              required
              style={{ minHeight: '150px' }}
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            <div className="form-group">
              <label>Job Type</label>
              <select value={formData.jobType} onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
                <option value="Internship">Internship</option>
                <option value="Learnerships">Learnerships</option>
              </select>
            </div>

            <div className="form-group">
              <label>Category</label>
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                <option value="Technology">Technology</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Design">Design</option>
                <option value="Finance">Finance</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Engineering">Engineering</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            <div className="form-group">
              <label>Salary Min</label>
              <input
                type="number"
                value={formData.salaryMin}
                onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Salary Max</label>
              <input
                type="number"
                value={formData.salaryMax}
                onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            <div className="form-group">
              <label>Experience Level</label>
              <select value={formData.experienceLevel} onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}>
                <option value="Entry">Entry</option>
                <option value="Mid">Mid</option>
                <option value="Senior">Senior</option>
              </select>
            </div>

            <div className="form-group">
              <label>Status</label>
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                <option value="active">Active</option>
                <option value="closed">Closed</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-lg)' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              Save Changes
            </button>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ApplicationsModal({ jobId, applications, loading, onClose }) {
  const statusColors = {
    pending: '#fff3cd',
    reviewed: '#cfe2ff',
    accepted: '#d4edda',
    rejected: '#f8d7da'
  };

  const statusTextColors = {
    pending: '#856404',
    reviewed: '#084298',
    accepted: '#155724',
    rejected: '#721c24'
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 'var(--space-lg)'
    }} onClick={onClose}>
      <div style={{
        background: 'white',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-xl)',
        maxWidth: '700px',
        maxHeight: '90vh',
        overflow: 'auto',
        width: '100%'
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
          <h2 style={{ margin: 0 }}>Job Applications</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
        </div>

        {loading ? (
          <p>Loading applications...</p>
        ) : applications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-lg)', color: 'var(--text-light)' }}>
            <p>No applications yet for this job</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
            {applications.map(app => (
              <div
                key={app._id}
                style={{
                  background: '#f9f9f9',
                  padding: 'var(--space-lg)',
                  borderRadius: 'var(--radius-sm)',
                  borderLeft: '4px solid var(--primary)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--space-md)' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem 0' }}>{app.userId?.name}</h4>
                    <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>
                      {app.userId?.email}
                    </p>
                  </div>
                  <span style={{
                    background: statusColors[app.status] || '#f0f0f0',
                    color: statusTextColors[app.status] || '#333',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    textTransform: 'capitalize',
                    whiteSpace: 'nowrap'
                  }}>
                    {app.status}
                  </span>
                </div>

                <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  <strong>Applied:</strong> {new Date(app.appliedAt).toLocaleDateString()}
                </p>

                {app.resumeUrl && (
                  <div style={{ marginTop: 'var(--space-md)', padding: 'var(--space-md)', background: '#d4edda', borderRadius: 'var(--radius-sm)' }}>
                    <p style={{ margin: '0 0 0.5rem 0', color: '#155724', fontSize: '0.9rem' }}>
                      <strong>📄 CV Attached:</strong>
                    </p>
                    <a
                      href={`/uploads/${app.resumeUrl}`}
                      download
                      style={{
                        color: '#0066cc',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        wordBreak: 'break-all'
                      }}
                    >
                      {app.resumeUrl}
                    </a>
                  </div>
                )}

                <div style={{ background: 'white', padding: 'var(--space-md)', borderRadius: 'var(--radius-sm)', marginTop: 'var(--space-sm)' }}>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', margin: '0 0 0.25rem 0' }}>
                    <strong>Notes:</strong>
                  </p>
                  <p style={{ fontSize: '0.9rem', color: '#666', margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {app.notes || 'No notes yet'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-lg)' }}>
          <button onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
