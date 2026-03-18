import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ClinicalData.css';

const ClinicalData = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileObject, setFileObject] = useState(null);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file.name);
      setFileObject(file);
    }
  };

  const handleSaveAndExit = async () => {
    if (!fileObject) {
      navigate('/dashboard');
      return;
    }

    const formData = new FormData();
    formData.append('userId', 1);
    formData.append('reportType', 'blood_report');
    formData.append('report', fileObject);

    try {
      const response = await fetch('http://localhost:5000/api/upload-report', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        navigate('/dashboard');
      } else {
        alert('Upload failed. Please try again.');
      }
    } catch (error) {
      alert('Error connecting to the server.');
    }
  };

  return (
    <div className="clinical-data-wrapper">
      <div className="top-nav-bar">
        <button 
          className="back-arrow" 
          onClick={() => navigate('/dashboard/diagnosis/cardiology')}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <h1 className="nav-title">Clinical and Diagnostic Data</h1>
      </div>

      <div className="clinical-data-content">
        <div className="upload-card">
          <div className="upload-header">
            <span className="upload-icon">🗂️</span> 
            <h2 className="upload-title">Upload Blood Report</h2>
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            style={{ display: 'none' }}
            accept=".pdf,.png,.jpg,.jpeg"
          />

          <button className="upload-btn" onClick={handleUploadClick}>
            {selectedFile ? 'Change File' : 'Upload'}
          </button>

          {selectedFile && (
            <p style={{ marginTop: '16px', color: '#14a098', fontWeight: '600' }}>
              ✓ Selected: {selectedFile}
            </p>
          )}
        </div>

        <div className="save-btn-container">
          <button 
            className="save-btn"
            onClick={handleSaveAndExit}
          >
            Save and exit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClinicalData;