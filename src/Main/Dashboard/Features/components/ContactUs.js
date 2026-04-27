import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../SharedFeatureGrid.css';

const ContactUs = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate sending to backend
    setTimeout(() => {
       setLoading(false);
       setSuccess(true);
    }, 1500);
  };

  return (
    <div className="feature-wrapper">
      <div className="feature-header">
        <button className="back-arrow" onClick={() => navigate('/dashboard')}>
           <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <h1 className="feature-title">Contact Us</h1>
      </div>

      <div className="feature-content">
        <div className="white-card">
          {success ? (
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ color: '#10b981', marginBottom: '1rem' }}>Message Sent!</h2>
              <p style={{ color: '#475569', marginBottom: '2rem' }}>Thank you {formData.name}, we have received your message and our support team will reach out to you at {formData.email} shortly.</p>
              <button className="primary-btn" onClick={() => setSuccess(false)} style={{ width: '100%' }}>Send Another Message</button>
            </div>
          ) : (
            <>
              <h2 style={{ margin: '0 0 1.5rem 0', color: '#1e293b' }}>We're here to help</h2>
              <form onSubmit={handleSubmit} className="feature-form">
                <div className="input-group">
                  <label>Full Name</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                
                <div className="input-group">
                  <label>Email Address</label>
                  <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>

                <div className="input-group">
                  <label>Subject</label>
                  <input type="text" required value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
                </div>

                <div className="input-group">
                  <label>Message</label>
                  <textarea rows="4" required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}></textarea>
                </div>

                <button type="submit" className="primary-btn" disabled={loading}>
                  {loading && <div className="loader-spinner"></div>}
                  {loading ? ' Sending...' : 'Send Message'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
