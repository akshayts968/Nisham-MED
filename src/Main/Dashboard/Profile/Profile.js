import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Profile.css'; 

const Profile = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  
  // New States for ECG History
  const [ecgRecords, setEcgRecords] = useState([]);
  const [selectedEcg, setSelectedEcg] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        // 1. Fetch Profile
        const profileRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/profile`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const profileJson = await profileRes.json();

        if (profileRes.ok) {
          setProfileData(profileJson.user);
          
          // 2. Fetch ECG Records using the ID we just got
          const ecgRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/ecg-records/${profileJson.user.id}`);
          const ecgJson = await ecgRes.json();
          if (ecgJson.status === 'success') {
            setEcgRecords(ecgJson.records);
          }
        } else {
          setError(profileJson.error || 'Failed to load profile');
        }
      } catch (err) {
        setError('Server connection failed. Is Flask running?');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  // Downsample 5000 points to 1000 for smooth, lag-free web rendering
  const getChartData = (dataArray) => {
    if (!dataArray) return [];
    return dataArray.filter((_, i) => i % 5 === 0).map((val, i) => ({
      time: i * 5,
      voltage: val
    }));
  };

  if (loading) return <div className="profile-loading">Loading Profile...</div>;
  if (error) return <div className="profile-error">Error: {error}</div>;

  return (
    <div className="profile-container">
      <button className="back-btn" onClick={() => navigate('/dashboard')}>
        ← Back to Dashboard
      </button>

      <div className="profile-card">
        {/* --- Header --- */}
        <div className="profile-header">
          <div className="profile-avatar">
            {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
          </div>
          <h2>{profileData.firstName} {profileData.lastName}</h2>
          <p className="profile-role">{profileData.role}</p>
        </div>

        {/* --- Details --- */}
        <div className="profile-details">
          <div className="detail-group">
            <label>Email Address</label>
            <p>{profileData.email}</p>
          </div>
          <div className="detail-group">
            <label>Mobile Number</label>
            <p>{profileData.mobile}</p>
          </div>
          <div className="detail-group">
            <label>Patient ID</label>
            <p className="mono-text">{profileData.id}</p>
          </div>
        </div>

        {/* --- NEW: ECG History Section --- */}
        {/* --- NEW: ECG History Section --- */}
{/* --- NEW: ECG History Section --- */}
        <div className="ecg-history-section">
          <h3 className="history-title">Recent ECG Scans</h3>
          {ecgRecords.length === 0 ? (
            <p className="no-records">No ECG scans found on your account.</p>
          ) : (
            <div className="ecg-list">
              {ecgRecords.map((rec, i) => {
                const dateObj = new Date(rec.timestamp);
                
                // FORCING Indian Standard Time (GMT +5:30)
                const formattedDate = dateObj.toLocaleDateString('en-GB', { 
                  timeZone: 'Asia/Kolkata', 
                  day: '2-digit', 
                  month: 'short', 
                  year: 'numeric' 
                });
                
                const formattedTime = dateObj.toLocaleTimeString('en-US', { 
                  timeZone: 'Asia/Kolkata', 
                  hour: '2-digit', 
                  minute: '2-digit', 
                  hour12: true 
                });
                
                const isExpanded = selectedEcg === rec;
                
                // Dynamic color coding based on the diagnosis
                const getBadgeColor = (diag) => {
                  if (diag.includes('Normal')) return 'diag-good';
                  if (diag.includes('Infarction') || diag.includes('Disturbance')) return 'diag-danger';
                  if (diag.includes('Offline') || diag.includes('Error')) return 'diag-offline';
                  return 'diag-warning'; 
                };

                // Graph Line Color
                const getLineColor = (diag) => {
                  if (diag.includes('Infarction') || diag.includes('Disturbance')) return '#ef4444'; // Red
                  if (diag.includes('Normal')) return '#10b981'; // Green
                  return '#38bdf8'; // Blue for others
                };

                return (
                  <div 
                    key={i} 
                    className={`ecg-list-item ${isExpanded ? 'expanded' : ''}`} 
                    onClick={() => setSelectedEcg(isExpanded ? null : rec)}
                  >
                    {/* --- The Clickable Header Row --- */}
                    <div className="ecg-item-header">
                      <div className="ecg-list-time">
                        <span className="ecg-date">{dateObj.toLocaleDateString()}</span>
                        <span className="ecg-time">{dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      
                      <div className="ecg-list-result">
                        <span className={`ecg-diag ${getBadgeColor(rec.diagnosis)}`}>
                          {rec.diagnosis}
                        </span>
                        <span className="ecg-conf">Confidence: <strong>{rec.confidence}%</strong></span>
                      </div>

                      <div className="ecg-arrow">
                        {isExpanded ? '▼' : '➔'}
                      </div>
                    </div>

                    {/* --- The Expanding Graph Div --- */}
                    {isExpanded && (
                      <div className="ecg-expanded-content" onClick={e => e.stopPropagation()}>
                        <div className="chart-wrapper">
                          <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={getChartData(rec.ecg_data_array)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                              {/* Medical Grid Background */}
                              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={true} horizontal={true}/>
                              <XAxis dataKey="time" hide={true} />
                              <YAxis domain={['auto', 'auto']} stroke="#64748b" tick={{ fontSize: 12 }} />
                              <Tooltip 
                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                                itemStyle={{ color: getLineColor(rec.diagnosis), fontWeight: 'bold' }}
                                labelStyle={{ display: 'none' }}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="voltage" 
                                stroke={getLineColor(rec.diagnosis)} 
                                dot={false} 
                                strokeWidth={2} 
                                isAnimationActive={true} 
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}
                    
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* --- NEW: Pop-up Graph Modal --- */}
      {selectedEcg && (
        <div className="ecg-modal-overlay" onClick={() => setSelectedEcg(null)}>
          <div className="ecg-modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Scan Details</h3>
              <button className="close-btn" onClick={() => setSelectedEcg(null)}>✕</button>
            </div>
            
            <p className="modal-meta">
              <strong>Time:</strong> {new Date(selectedEcg.timestamp).toLocaleString()} <br/>
              <strong>Diagnosis:</strong> <span className="highlight-diag">{selectedEcg.diagnosis}</span> ({selectedEcg.confidence}%)
            </p>

            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getChartData(selectedEcg.ecg_data_array)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false}/>
                  <XAxis dataKey="time" hide={true} />
                  <YAxis domain={['auto', 'auto']} stroke="#94a3b8" width={40} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    itemStyle={{ color: '#10b981' }}
                    labelStyle={{ display: 'none' }}
                  />
                  {/* The actual ECG Line */}
                  <Line type="monotone" dataKey="voltage" stroke="#10b981" dot={false} strokeWidth={2} isAnimationActive={true} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;