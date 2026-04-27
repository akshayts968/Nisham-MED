import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Spirometry.css';

const Spirometry = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fev1: '',
    fvc: '',
    pef: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate user ID retrieval from local storage (or replace with actual logic)
    const storedUser = localStorage.getItem('user');
    const userId = storedUser ? JSON.parse(storedUser).id : 'guest';

    try {
      const response = await fetch('http://localhost:5000/api/analyze-spirometry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          fev1: parseFloat(formData.fev1),
          fvc: parseFloat(formData.fvc),
          pef: parseFloat(formData.pef)
        })
      });
      
      const data = await response.json();
      if(response.ok) {
        setResult(data);
      } else {
        alert(data.error || 'Failed to analyze spirometry data');
      }
    } catch (error) {
      console.error(error);
      alert('Error connecting to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="spirometry-wrapper">
      <div className="top-nav-bar">
        <button className="back-arrow" onClick={() => navigate('/dashboard/diagnosis/respiratory')}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <h1 className="nav-title">Spirometry Analysis</h1>
      </div>

      <div className="spirometry-content">
        <div className="form-card">
          <h2>Enter Breath Metrics</h2>
          <p className="subtitle">Please enter your latest pulmonary function test results.</p>
          
          <form onSubmit={handleSubmit} className="spirometry-form">
            <div className="input-group">
              <label>FEV1 (Liters)</label>
              <input 
                type="number" 
                step="0.01" 
                name="fev1" 
                value={formData.fev1} 
                onChange={handleChange} 
                required 
                placeholder="e.g. 3.2"
              />
            </div>
            <div className="input-group">
              <label>FVC (Liters)</label>
              <input 
                type="number" 
                step="0.01" 
                name="fvc" 
                value={formData.fvc} 
                onChange={handleChange} 
                required 
                placeholder="e.g. 4.0"
              />
            </div>
            <div className="input-group">
              <label>PEF (L/min)</label>
              <input 
                type="number" 
                step="0.1" 
                name="pef" 
                value={formData.pef} 
                onChange={handleChange} 
                placeholder="Optional e.g. 400"
              />
            </div>

            <button type="submit" className="analyze-btn" disabled={loading}>
              {loading ? 'Analyzing...' : 'Analyze Data'}
            </button>
          </form>
        </div>

        {result && (
          <div className={`result-card ${result.status}`}>
            <h3>Diagnostic Result</h3>
            <div className="result-metric">
              <span>FEV1/FVC Ratio:</span>
              <strong>{result.ratio}%</strong>
            </div>
            <div className="result-diagnosis">
              <p>{result.diagnosis}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Spirometry;
