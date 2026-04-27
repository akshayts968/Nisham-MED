import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Neurology.css';

const Neurology = () => {
  const navigate = useNavigate();

  return (
    <div className="neurology-wrapper">
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
        <h1 className="nav-title">Neurology</h1>
      </div>

      {/* Main Content Area */}
      <div className="neurology-content">
        <div className="neurology-menu-card" onClick={() => alert('EEG Data feature coming soon!')}>
          <div className="card-icon-wrapper">
             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
               <path d="M12 2v20"></path>
               <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
             </svg>
          </div>
          <h2 className="neurology-menu-title">EEG / Brain Scan Data</h2>
        </div>

        <div className="neurology-menu-card" onClick={() => alert('Symptoms feature coming soon!')}>
          <div className="card-icon-wrapper">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
               <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
               <circle cx="12" cy="7" r="4"></circle>
             </svg>
          </div>
          <h2 className="neurology-menu-title">Physical Symptoms</h2>
        </div>

        <div className="neurology-menu-card" onClick={() => navigate('/dashboard/diagnosis/neurology/cognitive')}>
          <div className="card-icon-wrapper">
             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
               <circle cx="12" cy="12" r="10"></circle>
               <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
               <path d="M2 12h20"></path>
             </svg>
          </div>
          <h2 className="neurology-menu-title">Cognitive Assessment</h2>
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

export default Neurology;
