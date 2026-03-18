import React from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import the hook
import './Diagnosis.css';

const Diagnosis = () => {
  const navigate = useNavigate(); // 2. Initialize the hook

  return (
    <div className="diagnosis-wrapper">
      {/* Top Navigation Bar */}
      <div className="top-nav-bar">
        <button 
          className="back-arrow" 
          onClick={() => navigate('/dashboard')} // 3. Added the '/'
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <h1 className="nav-title">Diagnosis</h1>
      </div>

      {/* Main Grid Content */}
      <div className="diagnosis-content">
        
        {/* Cardiology Card */}
        <div 
          className="diagnosis-card"
          onClick={() => navigate('/dashboard/diagnosis/cardiology')} // 3. Added the '/'
        >
          <div className="card-icon-wrapper">
            {/* Professional Heart/ECG Line SVG */}
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
              <polyline points="3 12 8 12 10 8 14 16 16 12 21 12"></polyline>
            </svg>
          </div>
          <h2 className="card-title">Cardiology</h2>
        </div>

        {/* Neurology Card (Centered text) */}
        <div 
          className="diagnosis-card centered"
          onClick={() => navigate('/neurology')} // 3. Added the '/'
        >
          <h2 className="card-title">Neurology</h2>
        </div>

        {/* Respiratory Card */}
        <div 
          className="diagnosis-card"
          onClick={() => navigate('/respiratory')} // 3. Added the '/'
        >
          <div className="card-icon-wrapper">
            {/* Professional Lungs SVG */}
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v6"></path>
              <path d="M12 8c-2.5 0-5 1.5-5 5v5c0 2 1.5 3 3 3s3-1 3-3v-3"></path>
              <path d="M12 8c2.5 0 5 1.5 5 5v5c0 2-1.5 3-3 3s-3-1-3-3v-3"></path>
              <line x1="9" y1="14" x2="10" y2="14"></line>
              <line x1="15" y1="14" x2="14" y2="14"></line>
            </svg>
          </div>
          <h2 className="card-title">Respiratory</h2>
        </div>

      </div>
    </div>
  );
};

export default Diagnosis;