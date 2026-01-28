import { useState, useEffect } from 'react';
import { useAuthStore } from '../context/authStore';
import { useNavigate } from 'react-router-dom';

export default function PageManagement() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPage, setEditingPage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchPages();
  }, [isAuthenticated, user]);

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/pages');
      if (response.ok) {
        const data = await response.json();
        setPages(data.pages);
      }
    } catch (err) {
      setError('Failed to load pages');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePage = async (pageId) => {
    if (!window.confirm('Are you sure you want to delete this page?')) return;

    try {
      const response = await fetch(`/api/pages/${pageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        alert('✅ Page deleted successfully!');
        setPages(pages.filter(p => p._id !== pageId));
      }
    } catch (err) {
      alert('Error deleting page');
    }
  };

  if (loading) {
    return <div className="container" style={{ padding: 'var(--space-xl)' }}>Loading...</div>;
  }

  return (
    <div className="container" style={{ padding: 'var(--space-xl) var(--space-md)', maxWidth: '1200px' }}>
      <h1 className="mb-2">Manage Pages</h1>
      <p style={{ color: 'var(--text-light)', marginBottom: 'var(--space-lg)' }}>
        Create and manage navigation tabs and pages
      </p>

      {error && (
        <div style={{ background: 'rgba(239, 71, 111, 0.1)', color: 'var(--error)', padding: 'var(--space-md)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-lg)' }}>
          {error}
        </div>
      )}

      <button onClick={() => { setEditingPage(null); setShowForm(!showForm); }} className="btn btn-primary" style={{ marginBottom: 'var(--space-lg)' }}>
        {showForm ? 'Cancel' : '+ Add New Page'}
      </button>

      {showForm && (
        <PageForm
          page={editingPage}
          onSave={async (formData) => {
            try {
              const method = editingPage ? 'PUT' : 'POST';
              const url = editingPage ? `/api/pages/${editingPage._id}` : '/api/pages';

              const response = await fetch(url, {
                method,
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
              });

              if (response.ok) {
                const data = await response.json();
                if (editingPage) {
                  setPages(pages.map(p => p._id === data.page._id ? data.page : p));
                } else {
                  setPages([...pages, data.page]);
                }
                setShowForm(false);
                setEditingPage(null);
                alert('✅ Page saved successfully!');
              } else {
                const err = await response.json();
                alert(`Error: ${err.error}`);
              }
            } catch (err) {
              alert('Error saving page');
            }
          }}
          onCancel={() => { setShowForm(false); setEditingPage(null); }}
        />
      )}

      <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
        {pages.length === 0 ? (
          <div style={{ background: 'white', padding: 'var(--space-xl)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-light)' }}>No pages yet. Create your first page!</p>
          </div>
        ) : (
          pages.map(page => (
            <div key={page._id} style={{
              background: 'white',
              padding: 'var(--space-lg)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0' }}>{page.title}</h3>
                <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', margin: 0 }}>
                  {page.description || 'No description'}
                </p>
                <p style={{ color: '#999', fontSize: '0.85rem', margin: '0.5rem 0 0 0' }}>
                  Slug: /{page.slug}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                <button
                  onClick={() => { setEditingPage(page); setShowForm(true); }}
                  className="btn btn-primary"
                  style={{ padding: '0.5rem 1rem' }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeletePage(page._id)}
                  className="btn"
                  style={{ padding: '0.5rem 1rem', background: '#f8d7da', color: '#721c24', border: 'none' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function PageForm({ page, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: page?.title || '',
    description: page?.description || '',
    content: page?.content || '',
    order: page?.order || 0
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div style={{
      background: 'white',
      padding: 'var(--space-lg)',
      borderRadius: 'var(--radius-lg)',
      marginBottom: 'var(--space-lg)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <h2>{page ? 'Edit Page' : 'Create New Page'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Page Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., News, Funding, Career Advice"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Short description for this page"
          />
        </div>

        <div className="form-group">
          <label>Content</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows="10"
            placeholder="Enter page content here... (supports HTML)"
            style={{ minHeight: '300px' }}
          />
        </div>

        <div className="form-group">
          <label>Order (Display Order)</label>
          <input
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
            min="0"
          />
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
          <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
            {page ? 'Update Page' : 'Create Page'}
          </button>
          <button type="button" onClick={onCancel} className="btn btn-secondary" style={{ flex: 1 }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
