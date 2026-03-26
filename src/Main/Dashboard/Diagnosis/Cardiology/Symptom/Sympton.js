import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Symptom.css';

const Symptom = () => {
  const navigate = useNavigate();

  // 1. Added chestDiscomfort to the state
  const [formData, setFormData] = useState({
    physicalActivity: '',
    chestDiscomfort: '' ,
    exerciseAngina: ''
  });

  // 2. Fetch existing data on load
  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        const userId = 1; // Remember to replace this with your logged-in user's token ID later!
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/lifestyle-data/${userId}`);
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setFormData(data); 
          }
        }
      } catch (error) {
        console.error("Error fetching lifestyle data:", error);
      }
    };
    fetchExistingData();
  }, []);

  // 3. Handle inputs (Works for both Radio Buttons AND Select Dropdowns!)
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
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/lifestyle-data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 1, ...formData }), 
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
        <h1 className="nav-title">Symptoms</h1>
      </div>

      <div className="lifestyle-content">
        
        {/* NEW: Chest Discomfort Card */}
        <div className="form-card">
          <h2 className="section-title">Chest Discomfort Type</h2>
          <p className="subtitle-text">(Select the option closest to your condition)</p>
          
          <select 
            name="chestDiscomfort" 
            value={formData.chestDiscomfort} 
            onChange={handleChange}
            className="dropdown-select"
          >
            <option value="" disabled>Select an option ▼</option>
            <option value="0">Tight chest pain during activity</option>
            <option value="1">Mild or unusual chest pain</option>
            <option value="2">Chest pain not related to heart</option>
            <option value="3">No chest pain</option>
          </select>
        </div>
        {/* Exercise Induced Angina Card */}
        <div className="form-card">
          <h2 className="section-title">Chest Pain During Physical Activity</h2>
          <p className="subtitle-text">(Exercise Induced Angina)</p>
          
          <div className="radio-row physical-activity-row">
            <label className="radio-label">
              <input 
                type="radio" 
                name="exerciseAngina" 
                value="1" 
                checked={formData.exerciseAngina === '1'} 
                onChange={handleChange} 
              /> Yes
            </label>
            <label className="radio-label">
              <input 
                type="radio" 
                name="exerciseAngina" 
                value="0" 
                checked={formData.exerciseAngina === '0'} 
                onChange={handleChange} 
              /> No
            </label>
          </div>
        </div>
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

export default Symptom;