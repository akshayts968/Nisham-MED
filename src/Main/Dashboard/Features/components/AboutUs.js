import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../SharedFeatureGrid.css';

const AboutUs = () => {
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
        <h1 className="feature-title">About Us</h1>
      </div>

      <div className="feature-content" style={{ alignItems: 'normal' }}>
        <div className="cards-grid">
          <div className="white-card" style={{ flex: 1 }}>
            <h2 style={{ color: '#1e293b', marginTop: 0 }}>Our Mission</h2>
            <p style={{ color: '#475569', lineHeight: 1.6 }}>
              At standard Antigravity Medical, our goal is to provide world-class remote and in-person patient care. 
              We leverage cutting-edge AI technologies and an intuitive portal to bridge the gap between patients and providers.
            </p>
            <br />
            <h3 style={{ color: '#0f172a' }}>Emergency Contact</h3>
            <p style={{ color: '#dc2626', fontWeight: 600 }}>Call 911 for life-threatening emergencies.</p>
            <p style={{ color: '#475569' }}>24/7 Nurse Hotline: 1-800-NURSE-NOW</p>
          </div>

          <div className="white-card" style={{ flex: 1, padding: 0, overflow: 'hidden' }}>
             {/* Google Maps embed iframe showing GEC SKP Kerala */}
             <iframe 
               title="Clinic Location Map"
               src="https://maps.google.com/maps?q=GEC%20Sreekrishnapuram,%20Kerala&t=&z=15&ie=UTF8&iwloc=&output=embed" 
               width="100%" 
               height="100%" 
               style={{ border: 0, minHeight: '350px', display: 'block' }} 
               allowFullScreen="" 
               loading="lazy" 
               referrerPolicy="no-referrer-when-downgrade"
             ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
