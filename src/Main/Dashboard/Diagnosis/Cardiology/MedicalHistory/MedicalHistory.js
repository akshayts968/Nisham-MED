import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MedicalHistory.css';

const MedicalHistory = () => {
  const navigate = useNavigate();

  // 1. Updated state to hold the new AI metadata fields
  const [formData, setFormData] = useState({
    age: '',
    sex: '',
    height: '',
    weight: '',
    inf1: '',
    inf2: '',
    pace: '',
    extra: '',
    familyHistory: '',
    pastHeartProblem: ''
  });

  // 2. Fetch existing data when the page loads
  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        const userId = localStorage.getItem('userId'); 

        if (!userId) {
            console.error("No user ID found! Please log in again.");
            return;
        } 
        
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/medical-history/${userId}`);
        
        if (response.ok) {
          const data = await response.json();
          // Pre-fill the form with database data
          if (data) {
            setFormData({
              age: data.age || '',
              sex: data.sex || '',
              height: data.height || '',
              weight: data.weight || '',
              inf1: data.inf1 === 1 ? 'yes' : (data.inf1 === 0 ? 'no' : ''),
              inf2: data.inf2 === 1 ? 'yes' : (data.inf2 === 0 ? 'no' : ''),
              pace: data.pace === 1 ? 'yes' : (data.pace === 0 ? 'no' : ''),
              extra: data.extra === 1 ? 'yes' : (data.extra === 0 ? 'no' : ''),
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
  }, []); 

  // 3. Handle input and radio button changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Prevent age, height, and weight from getting too long
    if ((name === 'age' || name === 'height' || name === 'weight') && value.length > 3) {
      return; 
    }

    setFormData({
      ...formData,
      [name]: value
    });
  };

  // 4. API Call to save the data
  const handleSaveAndExit = async () => {
    try {
      const userId = localStorage.getItem('userId'); 

      if (!userId) {
          console.error("No user ID found! Please log in again.");
          return;
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
          height: formData.height,
          weight: formData.weight,
          inf1: formData.inf1,
          inf2: formData.inf2,
          pace: formData.pace,
          extra: formData.extra,
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
        
        {/* --- PATIENT VITALS CARD --- */}
        <div className="form-card">
          <h2 className="section-title">Patient Vitals</h2>
          
          <div className="form-row label-inline">
            <span className="form-label">AGE :</span>
            <input type="number" name="age" className="underlined-input" placeholder="Years" min="0" value={formData.age} onChange={handleChange} />
          </div>

          <div className="form-row label-inline">
            <span className="form-label" style={{ marginRight: '16px' }}>SEX :</span>
            <div className="radio-group">
              <label className="radio-label"><input type="radio" name="sex" value="male" checked={formData.sex === 'male'} onChange={handleChange} /> MALE</label>
              <label className="radio-label"><input type="radio" name="sex" value="female" checked={formData.sex === 'female'} onChange={handleChange} /> FEMALE</label>
            </div>
          </div>

          <div className="form-row label-inline">
            <span className="form-label">HEIGHT (cm) :</span>
            <input type="number" name="height" className="underlined-input" placeholder="e.g. 170" min="0" value={formData.height} onChange={handleChange} />
          </div>

          <div className="form-row label-inline">
            <span className="form-label">WEIGHT (kg) :</span>
            <input type="number" name="weight" className="underlined-input" placeholder="e.g. 70" min="0" value={formData.weight} onChange={handleChange} />
          </div>
        </div>

        {/* --- CLINICAL FLAGS CARD --- */}
        <div className="form-card">
          <h2 className="section-title">Clinical Flags</h2>

          <div className="form-row">
            <span className="form-label" style={{ marginBottom: '8px' }}>Pacemaker (Pace)</span>
            <div className="radio-group">
              <label className="radio-label"><input type="radio" name="pace" value="yes" checked={formData.pace === 'yes'} onChange={handleChange} /> YES</label>
              <label className="radio-label"><input type="radio" name="pace" value="no" checked={formData.pace === 'no'} onChange={handleChange} /> NO</label>
            </div>
          </div>

          <div className="form-row">
            <span className="form-label" style={{ marginBottom: '8px' }}>Infarction History 1 (Inf1)</span>
            <div className="radio-group">
              <label className="radio-label"><input type="radio" name="inf1" value="yes" checked={formData.inf1 === 'yes'} onChange={handleChange} /> YES</label>
              <label className="radio-label"><input type="radio" name="inf1" value="no" checked={formData.inf1 === 'no'} onChange={handleChange} /> NO</label>
            </div>
          </div>

          <div className="form-row">
            <span className="form-label" style={{ marginBottom: '8px' }}>Infarction History 2 (Inf2)</span>
            <div className="radio-group">
              <label className="radio-label"><input type="radio" name="inf2" value="yes" checked={formData.inf2 === 'yes'} onChange={handleChange} /> YES</label>
              <label className="radio-label"><input type="radio" name="inf2" value="no" checked={formData.inf2 === 'no'} onChange={handleChange} /> NO</label>
            </div>
          </div>

          <div className="form-row">
            <span className="form-label" style={{ marginBottom: '8px' }}>Extra Condition Flags</span>
            <div className="radio-group">
              <label className="radio-label"><input type="radio" name="extra" value="yes" checked={formData.extra === 'yes'} onChange={handleChange} /> YES</label>
              <label className="radio-label"><input type="radio" name="extra" value="no" checked={formData.extra === 'no'} onChange={handleChange} /> NO</label>
            </div>
          </div>
        </div>

        {/* --- GENERAL HISTORY CARD --- */}
        <div className="form-card">
          <div className="form-row">
            <span className="form-label" style={{ marginBottom: '16px' }}>Family history of heart disease</span>
            <div className="radio-group">
              <label className="radio-label"><input type="radio" name="familyHistory" value="yes" checked={formData.familyHistory === 'yes'} onChange={handleChange} /> YES</label>
              <label className="radio-label"><input type="radio" name="familyHistory" value="no" checked={formData.familyHistory === 'no'} onChange={handleChange} /> NO</label>
            </div>
          </div>

          <h2 className="section-title" style={{ marginTop: '24px' }}>Past heart problems</h2>
          <div className="radio-grid">
            <label className="radio-label"><input type="radio" name="pastHeartProblem" value="heartAttack" checked={formData.pastHeartProblem === 'heartAttack'} onChange={handleChange} /> Heart attack</label>
            <label className="radio-label"><input type="radio" name="pastHeartProblem" value="angina" checked={formData.pastHeartProblem === 'angina'} onChange={handleChange} /> Angina</label>
            <label className="radio-label"><input type="radio" name="pastHeartProblem" value="arrhythmia" checked={formData.pastHeartProblem === 'arrhythmia'} onChange={handleChange} /> Arrhythmia</label>
            <label className="radio-label"><input type="radio" name="pastHeartProblem" value="valveDisease" checked={formData.pastHeartProblem === 'valveDisease'} onChange={handleChange} /> Valve disease</label>
            <label className="radio-label"><input type="radio" name="pastHeartProblem" value="heartFailure" checked={formData.pastHeartProblem === 'heartFailure'} onChange={handleChange} /> Heart failure</label>
            <label className="radio-label"><input type="radio" name="pastHeartProblem" value="none" checked={formData.pastHeartProblem === 'none'} onChange={handleChange} /> None</label>
          </div>
        </div>

        <div className="save-btn-container">
          <button className="save-btn" onClick={handleSaveAndExit}>Save and exit</button>
        </div>

      </div>
    </div>
  );
};

export default MedicalHistory;