import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../SharedFeatureGrid.css';

const CallAppointment = () => {
  const navigate = useNavigate();

  return (
    <div className="feature-wrapper">
      <div className="feature-header">
        <button className="back-arrow" onClick={() => navigate('/dashboard')}>
           <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <h1 className="feature-title">Call For Appointment</h1>
      </div>

      <div className="feature-content">
        <div className="white-card" style={{ textAlign: 'center' }}>
          <div style={{ background: '#eff6ff', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
          </div>
          
          <h2 style={{ color: '#1e293b', marginBottom: '1rem' }}>Prefer to speak with us?</h2>
          <p style={{ color: '#475569', marginBottom: '2rem' }}>
            Our scheduling team is available Monday through Friday, 8:00 AM to 6:00 PM. Call us directly to book or manage your appointments.
          </p>

          <a href="tel:1-800-555-0199" style={{ textDecoration: 'none' }}>
            <button className="primary-btn" style={{ width: '100%', fontSize: '1.2rem', padding: '1.2rem' }}>
              Call 1-800-555-0199
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default CallAppointment;
