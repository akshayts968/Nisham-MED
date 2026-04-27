import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../SharedFeatureGrid.css';

const UploadDocuments = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if(e.type === 'dragenter' || e.type === 'dragover'){
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if(e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if(e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (f) => {
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if(!validTypes.includes(f.type)) {
      alert('Only JPG, PNG or PDF files are allowed.');
      return;
    }
    setFile(f);
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!file) return;

    setLoading(true);
    let userId = 'guest';
    let userString = localStorage.getItem('user');
    if(userString && userString !== "undefined") {
      try { userId = JSON.parse(userString).id; } catch(e){}
    }

    const formData = new FormData();
    formData.append('document', file);
    formData.append('userId', userId);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/api/upload_doc`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if(res.ok) {
        setSuccess('Document uploaded securely successfully!');
        setFile(null);
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err) {
      alert('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feature-wrapper">
      <div className="feature-header">
        <button className="back-arrow" onClick={() => navigate('/dashboard')}>
           <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <h1 className="feature-title">Upload Documents</h1>
      </div>

      <div className="feature-content">
        <div className="white-card">
           <form onSubmit={handleSubmit}>
              <div 
                 className={`dropzone ${isDragActive ? 'drag-active' : ''}`}
                 onDragEnter={handleDrag}
                 onDragLeave={handleDrag}
                 onDragOver={handleDrag}
                 onDrop={handleDrop}
                 onClick={() => document.getElementById('fileUploadInput').click()}
              >
                 <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem' }}>
                   <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                   <polyline points="17 8 12 3 7 8"></polyline>
                   <line x1="12" y1="3" x2="12" y2="15"></line>
                 </svg>
                 <p style={{ color: '#475569', margin: 0, fontWeight: 500 }}>
                    {file ? file.name : "Drag and drop your file here"}
                 </p>
                 <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                    Supported formats: PDF, JPG, PNG
                 </p>
                 <input type="file" id="fileUploadInput" accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }} onChange={handleChange} />
              </div>

              {success && <p style={{ color: '#10b981', textAlign: 'center', marginTop: '1rem', fontWeight: 500 }}>{success}</p>}

              <button type="submit" className="primary-btn" disabled={!file || loading} style={{ width: '100%', marginTop: '2rem' }}>
                {loading && <div className="loader-spinner"></div>}
                {loading ? ' Securely Uploading...' : 'Upload Document'}
              </button>
           </form>
           <button style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 600, width: '100%', marginTop: '1rem', cursor: 'pointer' }} onClick={() => navigate('/dashboard/documents')}>
             View Uploaded Documents
           </button>
        </div>
      </div>
    </div>
  );
};

export default UploadDocuments;
