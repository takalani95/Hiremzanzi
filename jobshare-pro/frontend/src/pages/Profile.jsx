import { useState, useEffect } from 'react';
import { useAuthStore } from '../context/authStore';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    skills: []
  });
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [isAuthenticated]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/users/me', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setFormData({
          name: data.user.name || '',
          email: data.user.email || '',
          phone: data.user.phone || '',
          location: data.user.location || '',
          bio: data.user.bio || '',
          skills: data.user.skills || []
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()]
      });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (index) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('/api/users/me/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          location: formData.location,
          bio: formData.bio,
          skills: formData.skills
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          const errorsMap = {};
          data.errors.forEach((err) => {
            errorsMap[err.param] = err.msg;
          });
          setFieldErrors(errorsMap);
          setError('Please fix the errors below');
        } else {
          setError(data.error || 'Failed to update profile');
        }
        return;
      }

      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px', padding: 'var(--space-xl) var(--space-md)' }}>
      <h1 className="mb-2">Edit Profile</h1>
      <p style={{ color: 'var(--text-light)', marginBottom: 'var(--space-lg)' }}>
        Update your information to help employers find you
      </p>

      <div style={{ background: 'white', padding: 'var(--space-xl)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
        {error && (
          <div style={{ background: 'rgba(239, 71, 111, 0.1)', color: 'var(--error)', padding: 'var(--space-md)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-md)' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ background: 'rgba(76, 175, 80, 0.1)', color: '#4CAF50', padding: 'var(--space-md)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-md)' }}>
            ✅ {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              style={fieldErrors.name ? { borderColor: 'var(--error)' } : {}}
            />
            {fieldErrors.name && <span style={{ color: 'var(--error)', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>{fieldErrors.name}</span>}
          </div>

          {/* Email (Read-only) */}
          <div className="form-group">
            <label>Email (Cannot be changed)</label>
            <input
              type="email"
              value={formData.email}
              disabled
              style={{ background: '#f5f5f5', cursor: 'not-allowed' }}
            />
          </div>

          {/* Phone */}
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+27 123 456 7890"
              style={fieldErrors.phone ? { borderColor: 'var(--error)' } : {}}
            />
            {fieldErrors.phone && <span style={{ color: 'var(--error)', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>{fieldErrors.phone}</span>}
          </div>

          {/* Location */}
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., Johannesburg, Gauteng"
              style={fieldErrors.location ? { borderColor: 'var(--error)' } : {}}
            />
            {fieldErrors.location && <span style={{ color: 'var(--error)', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>{fieldErrors.location}</span>}
          </div>

          {/* Bio */}
          <div className="form-group">
            <label>Professional Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell employers about yourself, your experience, and what you're looking for..."
              rows={5}
              maxLength={500}
              style={fieldErrors.bio ? { borderColor: 'var(--error)' } : {}}
            />
            <small style={{ color: 'var(--text-light)', display: 'block', marginTop: '0.25rem' }}>
              {formData.bio.length}/500 characters
            </small>
            {fieldErrors.bio && <span style={{ color: 'var(--error)', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>{fieldErrors.bio}</span>}
          </div>

          {/* Skills */}
          <div className="form-group">
            <label>Skills</label>
            <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="Add a skill (e.g., Python, Data Analysis)"
                style={{ flex: 1 }}
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="btn btn-primary"
                style={{ padding: 'var(--space-sm) var(--space-lg)' }}
              >
                Add
              </button>
            </div>

            {/* Skills List */}
            {formData.skills.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    style={{
                      background: 'var(--primary)',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '9999px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.9rem'
                    }}
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(index)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '1.2rem',
                        padding: 0,
                        lineHeight: 1
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: 'var(--space-lg)' }}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
