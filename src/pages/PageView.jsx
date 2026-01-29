import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function PageView() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPage();
  }, [slug]);

  const fetchPage = async () => {
    try {
      const response = await fetch(`/api/pages/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setPage(data.page);
      }
    } catch (error) {
      console.error('Error fetching page:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container" style={{ padding: 'var(--space-xl)' }}>Loading...</div>;
  }

  if (!page) {
    return <div className="container" style={{ padding: 'var(--space-xl)' }}><h2>Page not found</h2></div>;
  }

  return (
    <div className="container" style={{ padding: 'var(--space-xl) var(--space-md)', maxWidth: '1000px' }}>
      <h1>{page.title}</h1>
      {page.description && (
        <p style={{ color: 'var(--text-light)', fontSize: '1.1rem', marginBottom: 'var(--space-lg)' }}>
          {page.description}
        </p>
      )}
      <div style={{
        background: 'white',
        padding: 'var(--space-xl)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        lineHeight: '1.8'
      }}>
        {page.content ? (
          <div dangerouslySetInnerHTML={{ __html: page.content }} />
        ) : (
          <p style={{ color: 'var(--text-light)' }}>No content available for this page.</p>
        )}
      </div>
    </div>
  );
}
