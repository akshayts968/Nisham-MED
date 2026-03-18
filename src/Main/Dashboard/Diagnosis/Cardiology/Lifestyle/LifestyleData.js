import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LifestyleData.css';

const LifestyleData = () => {
  const navigate = useNavigate();

  // 1. State to hold form selections
  const [formData, setFormData] = useState({
    physicalActivity: '',
    smoking: '',
    alcoholUse: '',
    otherSubstances: ''
  });

  // 2. Fetch existing data on load
  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        const userId = 1; // Remember to replace this with your logged-in user's token ID later!
        const response = await fetch(`http://localhost:5000/api/lifestyle-data/${userId}`);
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setFormData(data); // Pre-fills the radio buttons!
          }
        }
      } catch (error) {
        console.error("Error fetching lifestyle data:", error);
      }
    };
    fetchExistingData();
  }, []);

  // 3. Handle radio button changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // 4. Save to database and return to dashboard
  const handleSaveAndExit = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/lifestyle-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 1, ...formData }), // Sending userId = 1 for now
      });

      if (!response.ok) {
        alert("Failed to save data.");
        return;
      }
      
      // Navigate back to the Cardiology menu
      navigate('/dashboard/diagnosis/cardiology');
    } catch (error) {
      console.error("Error saving lifestyle data:", error);
    }
  };

  return (
    <div className="lifestyle-wrapper">
      {/* Top Navigation Bar */}
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
        <h1 className="nav-title">Lifestyle & Behavioral Data</h1>
      </div>

      <div className="lifestyle-content">
        
        {/* Physical Activity Card */}
        <div className="form-card">
          <h2 className="section-title">Physical activity</h2>
          <div className="radio-row physical-activity-row">
            <label className="radio-label">
              <input type="radio" name="physicalActivity" value="walking" checked={formData.physicalActivity === 'walking'} onChange={handleChange} /> walking
            </label>
            <label className="radio-label">
              <input type="radio" name="physicalActivity" value="running" checked={formData.physicalActivity === 'running'} onChange={handleChange} /> running
            </label>
            <label className="radio-label">
              <input type="radio" name="physicalActivity" value="gym" checked={formData.physicalActivity === 'gym'} onChange={handleChange} /> Gym
            </label>
            <label className="radio-label">
              <input type="radio" name="physicalActivity" value="yoga" checked={formData.physicalActivity === 'yoga'} onChange={handleChange} /> Yoga
            </label>
            <label className="radio-label">
              <input type="radio" name="physicalActivity" value="none" checked={formData.physicalActivity === 'none'} onChange={handleChange} /> None
            </label>
          </div>
        </div>

        {/* Substance Use Card */}
        <div className="form-card">
          <h2 className="section-title">Substance use</h2>
          
          <div className="substance-grid">
            {/* Smoking Row */}
            <div className="substance-label">Smoking</div>
            <div className="radio-row">
              <label className="radio-label">
                <input type="radio" name="smoking" value="never" checked={formData.smoking === 'never'} onChange={handleChange} /> never
              </label>
              <label className="radio-label">
                <input type="radio" name="smoking" value="pack-years" checked={formData.smoking === 'pack-years'} onChange={handleChange} /> pack-years
              </label>
              <label className="radio-label">
                <input type="radio" name="smoking" value="past" checked={formData.smoking === 'past'} onChange={handleChange} /> past
              </label>
              <label className="radio-label">
                <input type="radio" name="smoking" value="current" checked={formData.smoking === 'current'} onChange={handleChange} /> current
              </label>
            </div>

            {/* Alcohol Use Row */}
            <div className="substance-label">Alcohol use</div>
            <div className="radio-row">
              <label className="radio-label">
                <input type="radio" name="alcoholUse" value="never" checked={formData.alcoholUse === 'never'} onChange={handleChange} /> never
              </label>
              <label className="radio-label">
                <input type="radio" name="alcoholUse" value="pack-years" checked={formData.alcoholUse === 'pack-years'} onChange={handleChange} /> pack-years
              </label>
              <label className="radio-label">
                <input type="radio" name="alcoholUse" value="past" checked={formData.alcoholUse === 'past'} onChange={handleChange} /> past
              </label>
              <label className="radio-label">
                <input type="radio" name="alcoholUse" value="current" checked={formData.alcoholUse === 'current'} onChange={handleChange} /> current
              </label>
            </div>

            {/* Other Substances Row */}
            <div className="substance-label">Other substances</div>
            <div className="radio-row">
              <label className="radio-label">
                <input type="radio" name="otherSubstances" value="never" checked={formData.otherSubstances === 'never'} onChange={handleChange} /> never
              </label>
              <label className="radio-label">
                <input type="radio" name="otherSubstances" value="past" checked={formData.otherSubstances === 'past'} onChange={handleChange} /> past
              </label>
              <label className="radio-label">
                <input type="radio" name="otherSubstances" value="current" checked={formData.otherSubstances === 'current'} onChange={handleChange} /> current
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="save-btn-container">
          <button className="save-btn" onClick={handleSaveAndExit}>
            Save and exit
          </button>
        </div>

      </div>
    </div>
  );
};

export default LifestyleData;