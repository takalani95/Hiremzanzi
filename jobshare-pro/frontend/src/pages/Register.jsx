import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const register = useAuthStore((state) => state.register);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    
    const result = await register({ ...formData, role: 'jobseeker' });
    
    if (result.success) {
      navigate('/dashboard');
    } else if (result.errors && Array.isArray(result.errors)) {
      // Handle validation errors array
      const errorsMap = {};
      result.errors.forEach((err) => {
        errorsMap[err.param] = err.msg;
      });
      setFieldErrors(errorsMap);
      setError('Please fix the errors below');
    } else {
      setError(result.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px', padding: 'var(--space-2xl) var(--space-md)' }}>
      <div style={{ background: 'white', padding: 'var(--space-xl)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
        <h2 className="text-center mb-2">Create Account</h2>
        <p className="text-center mb-3" style={{ color: 'var(--text-light)' }}>Join JobShare today</p>

        {error && (
          <div style={{ background: 'rgba(239, 71, 111, 0.1)', color: 'var(--error)', padding: 'var(--space-md)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-md)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              style={fieldErrors.name ? { borderColor: 'var(--error)' } : {}}
            />
            {fieldErrors.name && <span style={{ color: 'var(--error)', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>{fieldErrors.name}</span>}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              style={fieldErrors.email ? { borderColor: 'var(--error)' } : {}}
            />
            {fieldErrors.email && <span style={{ color: 'var(--error)', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>{fieldErrors.email}</span>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={6}
              style={fieldErrors.password ? { borderColor: 'var(--error)' } : {}}
            />
            {fieldErrors.password && <span style={{ color: 'var(--error)', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>{fieldErrors.password}</span>}
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--space-md)' }}>
            Create Account
          </button>
        </form>

        <p className="text-center mt-2" style={{ color: 'var(--text-light)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Login</Link>
        </p>
      </div>
    </div>
  );
}
