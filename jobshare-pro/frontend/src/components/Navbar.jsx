import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/pages');
      if (response.ok) {
        const data = await response.json();
        // Sort by order field
        const sortedPages = data.pages?.sort((a, b) => a.order - b.order) || [];
        setPages(sortedPages);
      }
    } catch (err) {
      console.error('Failed to fetch pages:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-content">
          <Link to="/" className="logo">
            Hire Mzansi
          </Link>
          
          <ul className="nav-links">
            <li><Link to="/jobs">Browse Jobs</Link></li>
            
            {/* Dynamic Pages Navigation */}
            {pages.map(page => (
              <li key={page._id}>
                <Link to={`/pages/${page.slug}`}>{page.title}</Link>
              </li>
            ))}
            
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <>
                    <li><Link to="/post-job">Post Job</Link></li>
                    <li><Link to="/job-management">Manage Jobs</Link></li>
                    <li><Link to="/page-management">Manage Pages</Link></li>
                    <li><Link to="/applications-management">Applications</Link></li>
                  </>
                )}
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li>
                  <button onClick={handleLogout} className="btn btn-secondary" style={{padding: '0.5rem 1.25rem'}}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login">Login</Link></li>
                <li>
                  <Link to="/register" className="btn btn-primary" style={{padding: '0.5rem 1.25rem'}}>
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
