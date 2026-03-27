import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MedicalHistory.css';

const MedicalHistory = () => {
  const navigate = useNavigate();

  // 1. Create state to hold the form data
  const [formData, setFormData] = useState({
    age: '',
    sex: '',
    familyHistory: '',
    pastHeartProblem: ''
  });

  // 2. Fetch existing data when the page loads
  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        const userId = localStorage.getItem('userId'); 

        // Always check if the user is actually logged in
        if (!userId) {
            console.error("No user ID found! Please log in again.");
        } // Hardcoded for now, replace with actual user ID later
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/medical-history/${userId}`);
        
        if (response.ok) {
          const data = await response.json();
          // If data exists, pre-fill the form!
          if (data) {
            setFormData({
              age: data.age || '',
              sex: data.sex || '',
              // Convert the database 1/0 back to yes/no for the radio buttons
              familyHistory: data.family_heart_history === 1 ? 'yes' : (data.family_heart_history === 0 ? 'no' : ''),
              pastHeartProblem: data.past_heart_problem || ''
            });
          }
        }
      } catch (error) {
        console.error("Error fetching medical history:", error);
      }
    };

    fetchExistingData();
  }, []); // Empty array means this runs exactly once when the component loads

  // 3. Handle input and radio button changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Custom logic to prevent age from exceeding 3 digits
    if (name === 'age' && value.length > 3) {
      return; 
    }

    setFormData({
      ...formData,
      [name]: value
    });
  };

  // 4. API Call to save or update the data
  const handleSaveAndExit = async () => {
    try {
      const userId = localStorage.getItem('userId'); 

// Always check if the user is actually logged in
        if (!userId) {
            console.error("No user ID found! Please log in again.");
        }
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/medical-history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId, 
          age: formData.age,
          sex: formData.sex,
          familyHistory: formData.familyHistory,
          pastHeartProblem: formData.pastHeartProblem
        }),
      });

      if (response.ok) {
        navigate('/dashboard');
      } else {
        alert("Failed to save medical history. Please try again.");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Cannot connect to the server. Is your backend running?");
    }
  };

  return (
    <div className="medical-history-wrapper">
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
        <h1 className="nav-title">Medical History</h1>
      </div>

      <div className="medical-history-content">
        
        <div className="form-card">
          <div className="form-row label-inline">
            <span className="form-label">AGE :</span>
            <input 
              type="number" 
              name="age"
              className="underlined-input" 
              placeholder="00"
              min="0" 
              value={formData.age}
              onChange={handleChange}
            />
          </div>

          <div className="form-row label-inline">
            <span className="form-label" style={{ marginRight: '16px' }}>SEX</span>
            <div className="radio-group">
              <label className="radio-label">
                <input type="radio" name="sex" value="male" checked={formData.sex === 'male'} onChange={handleChange} /> MALE
              </label>
              <label className="radio-label">
                <input type="radio" name="sex" value="female" checked={formData.sex === 'female'} onChange={handleChange} /> FEMALE
              </label>
              <label className="radio-label">
                <input type="radio" name="sex" value="other" checked={formData.sex === 'other'} onChange={handleChange} /> OTHER
              </label>
            </div>
          </div>

          <div className="form-row">
            <span className="form-label" style={{ marginBottom: '16px' }}>
              Family history of heart disease
            </span>
            <div className="radio-group">
              <label className="radio-label">
                <input type="radio" name="familyHistory" value="yes" checked={formData.familyHistory === 'yes'} onChange={handleChange} /> YES
              </label>
              <label className="radio-label">
                <input type="radio" name="familyHistory" value="no" checked={formData.familyHistory === 'no'} onChange={handleChange} /> NO
              </label>
            </div>
          </div>
        </div>

        <div className="form-card">
          <h2 className="section-title">Past heart problems</h2>
          
          <div className="radio-grid">
            <label className="radio-label">
              <input type="radio" name="pastHeartProblem" value="heartAttack" checked={formData.pastHeartProblem === 'heartAttack'} onChange={handleChange} /> Heart attack
            </label>
            <label className="radio-label">
              <input type="radio" name="pastHeartProblem" value="angina" checked={formData.pastHeartProblem === 'angina'} onChange={handleChange} /> Angina
            </label>
            <label className="radio-label">
              <input type="radio" name="pastHeartProblem" value="arrhythmia" checked={formData.pastHeartProblem === 'arrhythmia'} onChange={handleChange} /> Arrhythmia
            </label>
            <label className="radio-label">
              <input type="radio" name="pastHeartProblem" value="valveDisease" checked={formData.pastHeartProblem === 'valveDisease'} onChange={handleChange} /> Valve disease
            </label>
            <label className="radio-label">
              <input type="radio" name="pastHeartProblem" value="heartFailure" checked={formData.pastHeartProblem === 'heartFailure'} onChange={handleChange} /> Heart failure
            </label>
            <label className="radio-label">
              <input type="radio" name="pastHeartProblem" value="none" checked={formData.pastHeartProblem === 'none'} onChange={handleChange} /> None
            </label>
          </div>
        </div>

        <div className="save-btn-container">
          <button 
            className="save-btn"
            onClick={handleSaveAndExit}
          >
            Save and exit
          </button>
        </div>

      </div>
    </div>
  );
};

export default MedicalHistory;