import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Cardiology.css';

const Cardiology = () => {
  const navigate = useNavigate();

  return (
    <div className="cardiology-wrapper">
      {/* Top Navigation Bar */}
      <div className="top-nav-bar">
        <button 
          className="back-arrow" 
          onClick={() => navigate('/dashboard/diagnosis')} // Goes back to Diagnosis Menu
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <h1 className="nav-title">Cardiology</h1>
      </div>

      {/* Main Content Area */}
      <div className="cardiology-content">
        
        <div 
          className="cardiology-menu-card"
          onClick={() => navigate('/dashboard/diagnosis/cardiology/medical-history')}
        >
          <h2 className="cardiology-menu-title">Medical History</h2>
        </div>

        <div 
          className="cardiology-menu-card"
          onClick={() => navigate('/dashboard/diagnosis/cardiology/lifestyle-data')}
        >
          <h2 className="cardiology-menu-title">Symptoms</h2>
        </div>

        <div 
          className="cardiology-menu-card"
          onClick={() => navigate('/dashboard/diagnosis/cardiology/clinical-data')}
        >
          <h2 className="cardiology-menu-title">Clinical and Diagnostic Data</h2>
        </div>

        <div 
          className="cardiology-menu-card"
          onClick={() => navigate('/dashboard/diagnosis/cardiology/sensor-data')}
        >
          <h2 className="cardiology-menu-title">Sensor / Wearable Data</h2>
        </div>

        {/* Submit Button */}
        <div className="submit-btn-container">
          <button 
            className="submit-btn"
            onClick={() => navigate('/dashboard')} // Assuming submit finishes the flow and returns home
          >
            Submit
          </button>
        </div>

      </div>
    </div>
  );
};

export default Cardiology;