import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';
import { jobsAPI } from '../utils/api';

export default function PostJob() {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [formData, setFormData] = useState({
    title: '',
    company: user?.company || '',
    description: '',
    location: '',
    jobType: 'Full-time',
    category: 'Technology',
    salaryMin: '',
    salaryMax: '',
    contactEmail: user?.email || '',
    experienceLevel: 'Mid',
    applicationUrl: ''
  });

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="container mt-3">
        <h2>Access Denied</h2>
        <p>Only administrators can post jobs.</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    try {
      await jobsAPI.create(formData);
      alert('Job posted successfully!');
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        // Handle validation errors array
        const errorsMap = {};
        err.response.data.errors.forEach((error) => {
          errorsMap[error.param] = error.msg;
        });
        setFieldErrors(errorsMap);
        setError('Please fix the errors below');
      } else {
        setError(err.response?.data?.error || 'Error posting job. Please try again.');
      }
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px', padding: 'var(--space-xl) var(--space-md)' }}>
      <h1 className="mb-3">Post a New Job</h1>
      
      {error && (
        <div style={{ background: 'rgba(239, 71, 111, 0.1)', color: 'var(--error)', padding: 'var(--space-md)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-md)' }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} style={{ background: 'white', padding: 'var(--space-xl)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
        <div className="form-group">
          <label>Job Title *</label>
          <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required style={fieldErrors.title ? { borderColor: 'var(--error)' } : {}} />
          {fieldErrors.title && <span style={{ color: 'var(--error)', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>{fieldErrors.title}</span>}
        </div>

        <div className="form-group">
          <label>Company *</label>
          <input type="text" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} required style={fieldErrors.company ? { borderColor: 'var(--error)' } : {}} />
          {fieldErrors.company && <span style={{ color: 'var(--error)', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>{fieldErrors.company}</span>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
          <div className="form-group">
            <label>Location *</label>
            <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} required style={fieldErrors.location ? { borderColor: 'var(--error)' } : {}} />
            {fieldErrors.location && <span style={{ color: 'var(--error)', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>{fieldErrors.location}</span>}
          </div>

          <div className="form-group">
            <label>Job Type *</label>
            <select value={formData.jobType} onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
              <option value="Internship">Internship</option>
              <option value="Learnerships">Learnerships</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
          <div className="form-group">
            <label>Category *</label>
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

          <div className="form-group">
            <label>Experience Level *</label>
            <select value={formData.experienceLevel} onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}>
              <option value="Entry">Entry</option>
              <option value="Mid">Mid</option>
              <option value="Senior">Senior</option>
              <option value="Lead">Lead</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
          <div className="form-group">
            <label>Min Salary</label>
            <input type="number" value={formData.salaryMin} onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Max Salary</label>
            <input type="number" value={formData.salaryMax} onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })} />
          </div>
        </div>

        <div className="form-group">
          <label>Contact Email *</label>
          <input type="email" value={formData.contactEmail} onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })} required style={fieldErrors.contactEmail ? { borderColor: 'var(--error)' } : {}} />
          {fieldErrors.contactEmail && <span style={{ color: 'var(--error)', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>{fieldErrors.contactEmail}</span>}
        </div>

        <div className="form-group">
          <label>External Application URL (Optional)</label>
          <input type="url" value={formData.applicationUrl} onChange={(e) => setFormData({ ...formData, applicationUrl: e.target.value })} placeholder="https://company.com/careers/job-123" />
          <small style={{ color: 'var(--text-light)', marginTop: '0.25rem', display: 'block' }}>If provided, applicants will be redirected to this URL instead of applying through JobShare</small>
        </div>

        <div className="form-group">
          <label>Job Description *</label>
          <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={8} required style={fieldErrors.description ? { borderColor: 'var(--error)' } : {}} />
          {fieldErrors.description && <span style={{ color: 'var(--error)', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>{fieldErrors.description}</span>}
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
          Post Job
        </button>
      </form>
    </div>
  );
}
