import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PlaceholderPage.css';

const PlaceholderPage = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div className="placeholder-wrapper">
      <div className="top-nav-bar">
        <button 
          className="back-arrow" 
          onClick={() => navigate('/dashboard')}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <h1 className="nav-title">{title}</h1>
      </div>

      <div className="placeholder-content">
        <div className="illustration-wrapper">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#87CEFA" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        </div>
        <h2>Under Construction</h2>
        <p>The {title} feature is currently being built and will be available in a future update.</p>
      </div>
    </div>
  );
};

export default PlaceholderPage;
