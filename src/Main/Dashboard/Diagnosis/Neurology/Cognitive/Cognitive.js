import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cognitive.css';

const Cognitive = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    mocaScore: '',
    memoryRecall: 'Yes',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate user ID retrieval from local storage
    const storedUser = localStorage.getItem('user');
    const userId = storedUser ? JSON.parse(storedUser).id : 'guest';

    try {
      const response = await fetch('http://localhost:5000/api/analyze-cognitive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          mocaScore: parseInt(formData.mocaScore, 10),
          memoryRecall: formData.memoryRecall === 'Yes'
        })
      });
      
      const data = await response.json();
      if(response.ok) {
        setResult(data);
      } else {
        alert(data.error || 'Failed to analyze cognitive data');
      }
    } catch (error) {
      console.error(error);
      alert('Error connecting to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cognitive-wrapper">
      <div className="top-nav-bar">
        <button className="back-arrow" onClick={() => navigate('/dashboard/diagnosis/neurology')}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <h1 className="nav-title">Cognitive Assessment</h1>
      </div>

      <div className="cognitive-content">
        <div className="form-card">
          <h2>Clinical Exam Data</h2>
          <p className="subtitle">Enter the patient's standardized assessment scores (e.g., MoCA/MMSE).</p>
          
          <form onSubmit={handleSubmit} className="cognitive-form">
            <div className="input-group">
              <label>Standardized Score (0-30)</label>
              <input 
                type="number" 
                min="0" 
                max="30"
                name="mocaScore" 
                value={formData.mocaScore} 
                onChange={handleChange} 
                required 
                placeholder="e.g. 26"
              />
            </div>
            
            <div className="input-group">
              <label>Delayed Memory Recall Success?</label>
              <select name="memoryRecall" value={formData.memoryRecall} onChange={handleChange}>
                <option value="Yes">Yes, successful</option>
                <option value="No">No, failed</option>
              </select>
            </div>

            <button type="submit" className="analyze-btn" disabled={loading}>
              {loading ? 'Evaluating...' : 'Evaluate Score'}
            </button>
          </form>
        </div>

        {result && (
          <div className={`result-card ${result.status}`}>
            <h3>Neurological Overview</h3>
            <div className="result-metric">
              <span>Overall Score:</span>
              <strong>{result.score}/30</strong>
            </div>
            <div className="result-diagnosis">
              <p>{result.diagnosis}</p>
            </div>
            {result.recommendation && (
              <p className="recommendation"><em>Recommendation: {result.recommendation}</em></p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cognitive;
