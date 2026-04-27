import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import '../SharedFeatureGrid.css';

const AppointmentList = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('role') || 'patient';
    setIsAdmin(role === 'admin');

    const newSocket = io(process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000');
    setSocket(newSocket);
    
    // Listen for real-time updates
    newSocket.on('appointment_update', (updatedList) => {
      setAppointments(updatedList);
    });
    
    let userId = localStorage.getItem('userId') || 'guest';
    console.log("Fetching appointments for:", { userId, role });
    
    // Pass role to backend to secure data fetch
    newSocket.emit('get_appointments', { userId, role });

    newSocket.on('appointment_error', (err) => {
      console.error("Appointment Error:", err);
      alert("Error: " + (err.error || "Failed to fetch appointments"));
    });

    return () => newSocket.disconnect();
  }, []);

  const decodeToken = (token) => {
    if (!token || !token.startsWith('TKN-')) return null;
    const parts = token.split('-');
    if (parts.length < 3) return null;
    
    const encodedDate = parts[1];
    const sequence = parts[2];
    
    try {
      const decodedVal = parseInt(encodedDate, 36).toString();
      // Format 2604241347 -> 2026-04-24 13:47
      if (decodedVal.length >= 10) {
        const yr = "20" + decodedVal.substring(0, 2);
        const mo = decodedVal.substring(2, 4);
        const dy = decodedVal.substring(4, 6);
        const hr = decodedVal.substring(6, 8);
        const mi = decodedVal.substring(8, 10);
        return { date: `${yr}-${mo}-${dy} ${hr}:${mi}`, seq: sequence };
      }
    } catch (e) {
      return null;
    }
    return null;
  };

  const handleCancel = (token_number) => {
    if(window.confirm('Are you sure you want to cancel this appointment?')){
       if (socket) socket.emit('cancel_appointment', { id: token_number });
    }
  };

  const handleDelete = (token_number) => {
    if(window.confirm('ADMIN WARNING: This will permanently eradicate the appointment. Continue?')){
       if (socket) socket.emit('delete_appointment', { id: token_number });
       // Optimistic update
       setAppointments(appointments.filter(app => app.id !== token_number));
    }
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
        <h1 className="feature-title">{isAdmin ? 'Global Appointment Directory (Admin)' : 'My Appointments'}</h1>
      </div>

      <div className="feature-content">
        <div className="white-card wide">
          {appointments.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <h2 className="empty-state-title">No Appointments Yet</h2>
              <p className="empty-state-text">You haven't scheduled any appointments yet. Head over to our directory to find a doctor.</p>
              <button className="primary-btn" onClick={() => navigate('/dashboard/book-appointment')}>
                Book an Appointment
              </button>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Token #</th>
                  {isAdmin && <th>Collection Date</th>}
                  {isAdmin && <th>Seq #</th>}
                  {isAdmin && <th>Patient Name</th>}
                  <th>Date & Time</th>
                  <th>Doctor</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(app => (
                  <tr key={app.id}>
                     <td style={{ fontWeight: 600, color: '#3b82f6' }}>{app.token_number || app.id}</td>
                     {isAdmin && (
                        <td style={{ fontSize: '0.85rem', color: '#475569' }}>
                          {decodeToken(app.token_number)?.date || (app.created_at ? new Date(app.created_at).toLocaleString() : '-')}
                        </td>
                     )}
                     {isAdmin && (
                        <td style={{ fontWeight: 700, color: '#0f172a' }}>
                          {decodeToken(app.token_number)?.seq || (app.token_number ? app.token_number.split('-').pop() : '-')}
                        </td>
                     )}
                     {isAdmin && <td>{app.patient_name || 'Unknown Patient'}</td>}
                    <td>
                      <div style={{ fontWeight: 500, color: '#1e293b' }}>{app.date}</div>
                      <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{app.time && `at ${app.time}`}</div>
                    </td>
                    <td style={{ fontWeight: 500 }}>{app.doctor}</td>
                    <td>{app.department || app.dept || '-'}</td>
                    <td>
                      <span className={`status-badge ${app.status}`}>
                        {app.status ? app.status.charAt(0).toUpperCase() + app.status.slice(1) : ''}
                      </span>
                    </td>
                    <td>
                      {isAdmin ? (
                         <button onClick={() => handleDelete(app.id)} style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '0.4rem 0.8rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Delete</button>
                      ) : app.status === 'confirmed' || app.status === 'pending' ? (
                         <button onClick={() => handleCancel(app.id)} style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)', padding: '0.4rem 0.8rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
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

export default AppointmentList;
