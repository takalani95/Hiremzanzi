import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobsAPI } from '../utils/api';
import { useAuthStore } from '../context/authStore';

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [cvFile, setCvFile] = useState(null);
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyError, setApplyError] = useState('');
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const response = await jobsAPI.getById(id);
      setJob(response.data.job);
    } catch (error) {
      console.error('Error fetching job:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyClick = () => {
    // If job has external application URL, redirect to it
    if (job.applicationUrl) {
      window.open(job.applicationUrl, '_blank');
      return;
    }

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setShowApplyForm(true);
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setApplyError('');

    if (!cvFile) {
      setApplyError('Please upload your CV');
      return;
    }

    setApplyLoading(true);

    try {
      const formData = new FormData();
      formData.append('jobId', id);
      formData.append('cv', cvFile);

      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        setApplyError(data.error || 'Failed to submit application');
        return;
      }

      alert('✅ ' + (data.message || 'Application submitted successfully!'));
      setCvFile(null);
      setShowApplyForm(false);
    } catch (error) {
      setApplyError('An error occurred. Please try again.');
      console.error('Error:', error);
    } finally {
      setApplyLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading job details...</div>;
  if (!job) return <div className="container mt-3"><h2>Job not found</h2></div>;

  return (
    <div className="container" style={{ padding: 'var(--space-xl) var(--space-md)' }}>
      <div style={{ background: 'white', padding: 'var(--space-xl)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <h1 style={{ marginBottom: 'var(--space-sm)' }}>{job.title}</h1>
          <div className="company-name" style={{ fontSize: '1.25rem' }}>
            🏢 {job.company}
          </div>
        </div>

        <div className="job-tags" style={{ marginBottom: 'var(--space-lg)' }}>
          <span className="tag primary">{job.jobType}</span>
          <span className="tag">📍 {job.location}</span>
          <span className="tag">{job.category}</span>
          {job.experienceLevel && <span className="tag">{job.experienceLevel}</span>}
        </div>

        {job.salaryMin && job.salaryMax && (
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <strong>Salary: </strong>
            <span className="salary">
              ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
            </span>
          </div>
        )}

        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <h3>Job Description</h3>
          <p style={{ color: 'var(--text-light)', lineHeight: 1.7, marginTop: 'var(--space-sm)' }}>
            {job.description}
          </p>
        </div>

        {job.requirements && job.requirements.length > 0 && (
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <h3>Requirements</h3>
            <ul style={{ marginTop: 'var(--space-sm)', paddingLeft: 'var(--space-lg)' }}>
              {job.requirements.map((req, i) => (
                <li key={i} style={{ marginBottom: 'var(--space-xs)' }}>{req}</li>
              ))}
            </ul>
          </div>
        )}

        {!showApplyForm && (
          <button onClick={handleApplyClick} className="btn btn-primary" style={{ width: '100%' }}>
            {job.applicationUrl ? '🔗 Apply on Company Site' : 'Apply for this Position'}
          </button>
        )}

        {showApplyForm && (
          <div style={{ marginTop: 'var(--space-lg)', padding: 'var(--space-lg)', background: 'rgba(0, 0, 0, 0.02)', borderRadius: 'var(--radius-md)' }}>
            <h3>Submit Your Application</h3>
            {applyError && (
              <div style={{ background: 'rgba(239, 71, 111, 0.1)', color: 'var(--error)', padding: 'var(--space-md)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-md)' }}>
                {applyError}
              </div>
            )}
            <form onSubmit={handleSubmitApplication}>
              <div className="form-group">
                <label>Upload Your CV (PDF, DOC, DOCX) *</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                  required
                  style={{ padding: 'var(--space-md)', border: '2px dashed var(--primary)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
                />
                {cvFile && (
                  <p style={{ color: 'var(--success)', fontSize: '0.9rem', marginTop: 'var(--space-sm)' }}>
                    ✅ Selected: {cvFile.name}
                  </p>
                )}
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                <button type="submit" className="btn btn-primary" disabled={applyLoading}>
                  {applyLoading ? 'Submitting...' : 'Submit Application'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowApplyForm(false);
                    setCvFile(null);
                    setApplyError('');
                  }}
                  className="btn"
                  style={{ background: '#e0e0e0', color: '#333' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
