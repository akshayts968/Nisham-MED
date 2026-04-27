import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Respiratory.css';

const Respiratory = () => {
  const navigate = useNavigate();

  return (
    <div className="respiratory-wrapper">
      {/* Top Navigation Bar */}
      <div className="top-nav-bar">
        <button 
          className="back-arrow" 
          onClick={() => navigate('/dashboard/diagnosis')}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <h1 className="nav-title">Respiratory</h1>
      </div>

      {/* Main Content Area */}
      <div className="respiratory-content">
        <div className="respiratory-menu-card" onClick={() => navigate('/dashboard/diagnosis/respiratory/spirometry')}>
          <div className="card-icon-wrapper">
             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
               <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
             </svg>
          </div>
          <h2 className="respiratory-menu-title">Spirometry Data</h2>
        </div>

        <div className="respiratory-menu-card" onClick={() => alert('Symptoms feature coming soon!')}>
          <div className="card-icon-wrapper">
             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
               <path d="M12 2v6"></path>
               <path d="M12 8c-2.5 0-5 1.5-5 5v5c0 2 1.5 3 3 3s3-1 3-3v-3"></path>
               <path d="M12 8c2.5 0 5 1.5 5 5v5c0 2-1.5 3-3 3s-3-1-3-3v-3"></path>
             </svg>
          </div>
          <h2 className="respiratory-menu-title">Symptoms & Vitals</h2>
        </div>

        <div className="respiratory-menu-card" onClick={() => alert('Pulse Oximetry feature coming soon!')}>
          <div className="card-icon-wrapper">
             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
               <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
             </svg>
          </div>
          <h2 className="respiratory-menu-title">Pulse Oximetry</h2>
        </div>

        {/* Submit Button */}
        <div className="submit-btn-container">
          <button 
            className="submit-btn"
            onClick={() => navigate('/dashboard')}
          >
            Finish Diagnosis
          </button>
        </div>
      </div>
    </div>
  );
};

export default Respiratory;
