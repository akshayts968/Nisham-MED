import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../SharedFeatureGrid.css';

const LabReports = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        let userId = 'guest';
        let userString = localStorage.getItem('user');
        if(userString && userString !== "undefined") {
          try { userId = JSON.parse(userString).id; } catch(e){}
        }

        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/api/reports/${userId}`);
        const data = await res.json();
        
        if(res.ok) {
           setReports(data.reports || []);
        }
      } catch (err) {
        console.error("Failed to fetch reports", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="feature-wrapper">
      <div className="feature-header">
        <button className="back-arrow" onClick={() => navigate('/dashboard')}>
           <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <h1 className="feature-title">Lab Reports</h1>
      </div>

      <div className="feature-content">
        <div className="white-card wide">
          {loading ? (
             <div style={{ textAlign: 'center', padding: '2rem' }}><div className="loader-spinner"></div></div>
          ) : reports.length === 0 ? (
             <p style={{ textAlign: 'center', color: '#64748b' }}>No Lab Reports currently available for your account.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Test Name</th>
                  <th>Prescribing Doctor</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((rep, idx) => (
                  <tr key={idx}>
                    <td>{rep.date}</td>
                    <td>{rep.testName}</td>
                    <td>{rep.doctor}</td>
                    <td>
                      <span className={`status-badge ${rep.status.toLowerCase().replace(' ', '-')}`}>
                        {rep.status}
                      </span>
                    </td>
                    <td>
                      {rep.status === 'Ready' ? (
                        <a href={rep.downloadUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>View PDF</a>
                      ) : (
                        <span style={{ color: '#94a3b8' }}>-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default LabReports;
