import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ClinicalData.css';

const ClinicalData = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // File state
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileObject, setFileObject] = useState(null);
  
  // NEW: State to hold the Cloudinary URL from the database
  const [uploadedFileUrl, setUploadedFileUrl] = useState(null);

  // Clinical vitals state
  const [formData, setFormData] = useState({
    restingBP: '',
    cholesterol: '',
    fastingBS: '',
    maxHR: ''
  });

  // --- 1. Fetch Existing Data on Load ---
  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) return;

        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/health-report/${userId}`);
        
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setFormData({
              restingBP: data.resting_bp || '',
              cholesterol: data.cholesterol || '',
              fastingBS: data.fasting_bs || '',
              maxHR: data.max_hr || ''
            });
            
            // If they have a cloud file, save the URL to state!
            if (data.file_url) {
              setUploadedFileUrl(data.file_url);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching clinical data:", error);
      }
    };
    fetchExistingData();
  }, []);

  // --- 2. Handle Inputs & Uploads ---
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // --- 3. Save Data & File ---
  const handleSaveAndExit = async () => {
    const userId = localStorage.getItem('userId'); 

    if (!userId) {
        console.error("No user ID found! Please log in again.");
        return; 
    } 

    const submitData = new FormData();
    submitData.append('userId', userId);
    submitData.append('reportType', 'blood_report');
    
    // Append the file if they selected a NEW one
    if (fileObject) {
      submitData.append('report', fileObject);
    }

    submitData.append('restingBP', formData.restingBP);
    submitData.append('cholesterol', formData.cholesterol);
    submitData.append('fastingBS', formData.fastingBS);
    submitData.append('maxHR', formData.maxHR);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/upload-report`, {
        method: 'POST',
        body: submitData, 
      });

      if (response.ok) {
        navigate('/dashboard/diagnosis/cardiology');
      } else {
        alert('Failed to save data. Please try again.');
      }
    } catch (error) {
      alert('Error connecting to the server.');
    }
  };

  return (
    <div className="clinical-data-wrapper">
      <div className="top-nav-bar">
        <button className="back-arrow" onClick={() => navigate('/dashboard/diagnosis/cardiology')}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <h1 className="nav-title">Clinical and Diagnostic Data</h1>
      </div>

      <div className="clinical-data-content">
        
        {/* Vitals & Blood Panel */}
        <div className="form-card">
          <h2 className="section-title">Vitals & Blood Panel</h2>
          <div className="input-grid">
            <div className="input-group">
              <label className="input-label">Resting Blood Pressure (mmHg)</label>
              <input type="number" name="restingBP" value={formData.restingBP} onChange={handleChange} className="text-input" placeholder="Example: 120" />
            </div>

            <div className="input-group">
              <label className="input-label">Cholesterol Level (mg/dL)</label>
              <input type="number" name="cholesterol" value={formData.cholesterol} onChange={handleChange} className="text-input" placeholder="Example: 200" />
            </div>

            <div className="input-group">
              <label className="input-label">Maximum Heart Rate (bpm)</label>
              <input type="number" name="maxHR" value={formData.maxHR} onChange={handleChange} className="text-input" placeholder="Example: 150" />
            </div>

            <div className="input-group full-width">
              <label className="input-label">Fasting Blood Sugar above 120 mg/dL</label>
              <div className="radio-row">
                <label className="radio-label">
                  <input type="radio" name="fastingBS" value="1" checked={formData.fastingBS === '1'} onChange={handleChange} /> Yes
                </label>
                <label className="radio-label">
                  <input type="radio" name="fastingBS" value="0" checked={formData.fastingBS === '0'} onChange={handleChange} /> No
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Card */}
        <div className="form-card upload-card">
          <div className="upload-header">
            <span className="upload-icon">🗂️</span> 
            <h2 className="upload-title">Upload Blood Report</h2>
          </div>

          {/* NEW: If a file exists in the cloud, show a link to view it! */}
          {uploadedFileUrl && !selectedFile && (
            <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#e9f7ef', borderRadius: '8px', border: '1px solid #28a745' }}>
              <p style={{ margin: '0 0 5px 0', color: '#28a745', fontWeight: 'bold' }}>✓ Report on File</p>
              <a href={uploadedFileUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'none' }}>
                📄 View Current Cloud Report
              </a>
            </div>
          )}
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            style={{ display: 'none' }}
            accept=".pdf,.png,.jpg,.jpeg"
          />

          <button className="upload-btn" onClick={handleUploadClick}>
            {selectedFile || uploadedFileUrl ? 'Upload New File' : 'Upload File'}
          </button>

          {selectedFile && (
            <p className="success-text">
              ✓ Ready to upload: {selectedFile}
            </p>
          )}
        </div>

        <div className="save-btn-container">
          <button className="save-btn" onClick={handleSaveAndExit}>
            Save and exit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClinicalData;