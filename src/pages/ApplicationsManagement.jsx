import { useState, useEffect } from 'react';
import { useAuthStore } from '../context/authStore';
import { useNavigate } from 'react-router-dom';

export default function ApplicationsManagement() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchApplications();
  }, [isAuthenticated, user]);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/applications', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || []);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      const response = await fetch(`/api/applications/${appId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          status: newStatus,
          notes: notes || undefined
        })
      });

      if (response.ok) {
        alert('✅ Status updated! Email sent to applicant.');
        setNotes('');
        fetchApplications();
        setSelectedApp(null);
      }
    } catch (error) {
      console.error('Error updating application:', error);
    }
  };

  const filteredApplications = filterStatus === 'all' 
    ? applications 
    : applications.filter(app => app.status === filterStatus);

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
    <div className="container" style={{ padding: 'var(--space-xl) var(--space-md)', maxWidth: '1200px' }}>
      <h1 className="mb-2">Applications Management</h1>
      <p style={{ color: 'var(--text-light)', marginBottom: 'var(--space-lg)' }}>
        Review and manage all job applications
      </p>

      {/* Filter Buttons */}
      <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)', flexWrap: 'wrap' }}>
        {['all', 'pending', 'reviewed', 'accepted', 'rejected'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              background: filterStatus === status ? 'var(--primary)' : '#f0f0f0',
              color: filterStatus === status ? 'white' : '#333',
              cursor: 'pointer',
              fontWeight: 500,
              textTransform: 'capitalize'
            }}
          >
            {status === 'all' ? 'All' : status} ({filteredApplications.length})
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading applications...</p>
      ) : filteredApplications.length === 0 ? (
        <div style={{ background: 'white', padding: 'var(--space-xl)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
            No {filterStatus !== 'all' ? filterStatus : ''} applications yet
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 'var(--space-lg)' }}>
          {filteredApplications.map(app => (
            <div key={app._id} style={{
              background: 'white',
              padding: 'var(--space-lg)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
              cursor: 'pointer',
              border: selectedApp?._id === app._id ? '2px solid var(--primary)' : '1px solid #eee'
            }} onClick={() => setSelectedApp(app)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--space-md)' }}>
                <div>
                  <h3 style={{ marginBottom: '0.25rem' }}>{app.userId?.name}</h3>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    {app.userId?.email}
                  </p>
                </div>
                <span style={{
                  background: statusColors[app.status],
                  color: statusTextColors[app.status],
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textTransform: 'capitalize'
                }}>
                  {app.status}
                </span>
              </div>

              <p style={{ color: 'var(--text-light)', marginBottom: 'var(--space-sm)' }}>
                <strong>Position:</strong> {app.jobId?.title}
              </p>
              <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: 'var(--space-md)' }}>
                Applied: {new Date(app.appliedAt).toLocaleDateString()}
              </p>

              {app.resumeUrl && (
                <div style={{ marginBottom: 'var(--space-md)' }}>
                  <a 
                    href={`/api/applications/${app._id}/cv`}
                    download
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      display: 'inline-block',
                      padding: '0.5rem 1rem',
                      background: '#e3f2fd',
                      color: '#1976d2',
                      borderRadius: 'var(--radius-sm)',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}
                  >
                    📄 Download CV
                  </a>
                </div>
              )}

              <div style={{ marginBottom: 'var(--space-md)', paddingTop: 'var(--space-md)', borderTop: '1px solid #eee' }}>
                <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Cover Letter:</p>
                <p style={{ fontSize: '0.9rem', color: '#666', maxHeight: '100px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {app.coverLetter || 'No cover letter provided'}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedApp(app);
                  setNotes(app.notes || '');
                }}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Review Application
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Application Detail Modal */}
      {selectedApp && (
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
        }} onClick={() => setSelectedApp(null)}>
          <div style={{
            background: 'white',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-xl)',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: 'var(--shadow-lg)'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
              <h2>{selectedApp.userId?.name}</h2>
              <button
                onClick={() => setSelectedApp(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>

            {/* Applicant Info */}
            <div style={{ background: '#f9f9f9', padding: 'var(--space-lg)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-lg)' }}>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Email:</strong> {selectedApp.userId?.email}
              </p>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Position:</strong> {selectedApp.jobId?.title}
              </p>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Applied:</strong> {new Date(selectedApp.appliedAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Current Status:</strong>{' '}
                <span style={{
                  background: statusColors[selectedApp.status],
                  color: statusTextColors[selectedApp.status],
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textTransform: 'capitalize'
                }}>
                  {selectedApp.status}
                </span>
              </p>
            </div>

            {/* Cover Letter */}
            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <h4 style={{ marginBottom: 'var(--space-sm)' }}>Uploaded CV</h4>
              {selectedApp.resumeUrl ? (
                <a 
                  href={`/api/applications/${selectedApp._id}/cv`}
                  download
                  style={{
                    display: 'inline-block',
                    padding: '0.75rem 1.5rem',
                    background: '#1976d2',
                    color: 'white',
                    borderRadius: 'var(--radius-sm)',
                    textDecoration: 'none',
                    fontWeight: 500,
                    marginBottom: 'var(--space-lg)'
                  }}
                >
                  📥 Download CV ({selectedApp.resumeUrl.split('_').pop()})
                </a>
              ) : (
                <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', background: '#fff3cd', padding: 'var(--space-sm)', borderRadius: 'var(--radius-sm)' }}>
                  ⚠️ No CV file uploaded
                </p>
              )}
            </div>

            {/* Cover Letter */}
            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <h4 style={{ marginBottom: 'var(--space-sm)' }}>Cover Letter</h4>
              <div style={{
                background: '#f9f9f9',
                padding: 'var(--space-lg)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.95rem',
                lineHeight: 1.6,
                maxHeight: '200px',
                overflowY: 'auto'
              }}>
                {selectedApp.coverLetter || 'No cover letter provided'}
              </div>
            </div>

            {/* Notes */}
            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <label style={{ display: 'block', marginBottom: 'var(--space-sm)', fontWeight: 500 }}>
                Internal Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add private notes about this application..."
                rows={3}
                style={{
                  width: '100%',
                  padding: 'var(--space-sm)',
                  border: '1px solid #ddd',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'inherit',
                  fontSize: '0.95rem',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Status Update Buttons */}
            <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
              {['pending', 'reviewed', 'accepted', 'rejected'].map(status => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(selectedApp._id, status)}
                  disabled={selectedApp.status === status}
                  style={{
                    padding: '0.5rem 1rem',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    background: selectedApp.status === status ? '#ddd' : statusColors[status],
                    color: statusTextColors[status],
                    cursor: selectedApp.status === status ? 'default' : 'pointer',
                    fontWeight: 500,
                    textTransform: 'capitalize',
                    opacity: selectedApp.status === status ? 0.5 : 1
                  }}
                >
                  Mark as {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
