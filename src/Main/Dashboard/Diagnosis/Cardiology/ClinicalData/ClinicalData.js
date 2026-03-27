import React, { useRef, useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ClinicalData.css';

const ClinicalData = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // File state
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileObject, setFileObject] = useState(null);

  // NEW: Clinical vitals state
  const [formData, setFormData] = useState({
    restingBP: '',
    cholesterol: '',
    fastingBS: '',
    maxHR: ''
  });
// NEW: Fetch existing clinical data on load
  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) return;

        // Note the new route name: health-report
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/health-report/${userId}`);
        
        if (response.ok) {
          const data = await response.json();
          if (data) {
            // Update the form with the database values
            setFormData({
              restingBP: data.resting_bp || '',
              cholesterol: data.cholesterol || '',
              fastingBS: data.fasting_bs || '',
              maxHR: data.max_hr || ''
            });
            
            // If they previously uploaded a file, show a message
            if (data.file_path) {
              setSelectedFile("Previous report uploaded");
            }
          }
        }
      } catch (error) {
        console.error("Error fetching clinical data:", error);
      }
    };
    fetchExistingData();
  }, []);
  // Handle file uploads
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

  // NEW: Handle clinical input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSaveAndExit = async () => {
    // Note: You can remove this check if you want users to be able to save clinical data WITHOUT uploading a file
    if (!fileObject && !formData.restingBP && !formData.cholesterol) {
      navigate('/dashboard');
      return;
    }
    const userId = localStorage.getItem('userId'); 

    if (!userId) {
        console.error("No user ID found! Please log in again.");
        return; // Exit early if no user
    } 
    // We use FormData so we can send both the file AND the text inputs together
    const submitData = new FormData();
    submitData.append('userId', userId);
    submitData.append('reportType', 'blood_report');
    
    // Append the file if it exists
    if (fileObject) {
      submitData.append('report', fileObject);
    }

    // Append all clinical data
    submitData.append('restingBP', formData.restingBP);
    submitData.append('cholesterol', formData.cholesterol);
    submitData.append('fastingBS', formData.fastingBS);
    submitData.append('maxHR', formData.maxHR);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/upload-report`, {
        method: 'POST',
        body: submitData, // Automatically sets multipart/form-data headers
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
        
        {/* NEW: Clinical Vitals Card */}
        <div className="form-card">
          <h2 className="section-title">Vitals & Blood Panel</h2>

          <div className="input-grid">
            {/* Resting BP */}
            <div className="input-group">
              <label className="input-label">Resting Blood Pressure (mmHg)</label>
              <input 
                type="number" 
                name="restingBP" 
                value={formData.restingBP} 
                onChange={handleChange} 
                className="text-input" 
                placeholder="Example: 120" 
              />
            </div>

            {/* Cholesterol */}
            <div className="input-group">
              <label className="input-label">Cholesterol Level (mg/dL)</label>
              <input 
                type="number" 
                name="cholesterol" 
                value={formData.cholesterol} 
                onChange={handleChange} 
                className="text-input" 
                placeholder="Example: 200" 
              />
            </div>

            {/* Max HR */}
            <div className="input-group">
              <label className="input-label">Maximum Heart Rate (bpm)</label>
              <input 
                type="number" 
                name="maxHR" 
                value={formData.maxHR} 
                onChange={handleChange} 
                className="text-input" 
                placeholder="Example: 150" 
              />
            </div>

            {/* Fasting Blood Sugar */}
            <div className="input-group full-width">
              <label className="input-label">Fasting Blood Sugar above 120 mg/dL</label>
              <div className="radio-row">
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="fastingBS" 
                    value="1" 
                    checked={formData.fastingBS === '1'} 
                    onChange={handleChange} 
                  /> Yes
                </label>
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="fastingBS" 
                    value="0" 
                    checked={formData.fastingBS === '0'} 
                    onChange={handleChange} 
                  /> No
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Existing Upload Card */}
        <div className="form-card upload-card">
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
            {selectedFile ? 'Change File' : 'Upload File'}
          </button>

          {selectedFile && (
            <p className="success-text">
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