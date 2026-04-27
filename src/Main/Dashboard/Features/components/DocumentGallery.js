import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../SharedFeatureGrid.css';

const DocumentGallery = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        let userId = 'guest';
        let userString = localStorage.getItem('user');
        if(userString && userString !== "undefined") {
          try { userId = JSON.parse(userString).id; } catch(e){}
        }

        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/api/documents/${userId}`);
        const data = await res.json();
        
        if(res.ok) {
           setDocuments(data.documents || []);
        }
      } catch (err) {
        console.error("Failed to fetch documents", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  return (
    <div className="feature-wrapper">
      <div className="feature-header">
        <button className="back-arrow" onClick={() => navigate('/dashboard')}>
           <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <h1 className="feature-title">Document Gallery</h1>
      </div>

      <div className="feature-content" style={{ alignItems: 'normal' }}>
        {loading ? (
           <div style={{ textAlign: 'center', padding: '3rem' }}><div className="loader-spinner"></div></div>
        ) : documents.length === 0 ? (
           <div className="white-card" style={{ textAlign: 'center', alignSelf: 'center' }}>
              <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Your secure document repository is empty.</p>
              <button className="primary-btn" onClick={() => navigate('/dashboard/upload-documents')}>Upload Something</button>
           </div>
        ) : (
           <div className="cards-grid">
             {documents.map((doc, i) => (
                <div key={i} className="mini-card" style={{ alignItems: 'flex-start', textAlign: 'left' }}>
                  <div style={{ background: '#f1f5f9', padding: '1rem', borderRadius: '10px', marginBottom: '1rem', width: '100%', boxSizing: 'border-box', display: 'flex', justifyContent: 'center' }}>
                     {doc.type === 'image' ? (
                       <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                     ) : (
                       <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                     )}
                  </div>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e293b', fontSize: '1.1rem', wordBreak: 'break-all' }}>{doc.filename}</h3>
                  <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0 0 1rem 0' }}>Uploaded: {doc.date}</p>
                  
                  <a href={doc.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', width: '100%' }}>
                     <button className="primary-btn" style={{ width: '100%', padding: '0.6rem' }}>View</button>
                  </a>
                </div>
             ))}
           </div>
        )}
      </div>
    </div>
  );
};

export default DocumentGallery;
