import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import '../SharedFeatureGrid.css';

const BookAppointment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isGuest = !localStorage.getItem('token');
  const isAdmin = localStorage.getItem('role') === 'admin';
  const showPatientFields = isGuest || isAdmin;
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState('');
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [formData, setFormData] = useState({
    patientName: '',
    mobile: '',
    department: location.state?.dept || 'Cardiology',
    doctor: location.state?.doctor || 'Dr. Smith (Cardiology)',
    date: '',
    time: ''
  });

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('appointment_booked', (response) => {
      setLoading(false);
      setSuccess(true);
      if (response.token) setToken(response.token);
    });

    newSocket.on('appointment_error', (response) => {
      setLoading(false);
      setError(response.error);
      setSuggestions(response.suggested || []);
    });

    return () => newSocket.disconnect();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    let userId = localStorage.getItem('userId') || 'guest';
    
    if (socket) {
      socket.emit('book_appointment', { userId, ...formData });
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
        <h1 className="feature-title">Book An Appointment</h1>
      </div>

      <div className="feature-content">
        <div className="white-card">
          {success ? (
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ color: '#10b981', marginBottom: '1rem' }}>Appointment Confirmed!</h2>
              <p style={{ color: '#475569', marginBottom: '1rem' }}>
                Your appointment with <strong>{formData.doctor}</strong> has been scheduled for <strong>{formData.date}</strong> at <strong>{formData.time}</strong>.
              </p>
              {token && (
                <div style={{ background: '#f0fdf4', border: '1px solid #10b981', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Token Number</span>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#065f46', margin: '0.5rem 0' }}>{token}</div>
                  <p style={{ fontSize: '0.85rem', color: '#065f46', margin: 0 }}>Please present this token at the reception.</p>
                </div>
              )}
              <button className="primary-btn" onClick={() => navigate('/dashboard/appointment-list')} style={{ width: '100%' }}>View My Appointments</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="feature-form">
              {showPatientFields && (
                <>
                  <div className="input-group">
                    <label>Patient Name</label>
                    <input type="text" required placeholder="Full Name" value={formData.patientName} onChange={e => setFormData({...formData, patientName: e.target.value})} />
                  </div>

                  <div className="input-group">
                    <label>Mobile Number</label>
                    <input type="tel" required placeholder="Phone Number" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} />
                  </div>
                </>
              )}

              <div className="input-group">
                <label>Department</label>
                <select value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}>
                  <option>Cardiology</option>
                  <option>Neurology</option>
                  <option>Respiratory</option>
                  <option>General Practice</option>
                </select>
              </div>

              <div className="input-group">
                <label>Preferred Doctor</label>
                <select value={formData.doctor} onChange={e => setFormData({...formData, doctor: e.target.value})}>
                  {location.state?.doctor && !['Dr. Smith (Cardiology)', 'Dr. Adams (Neurology)', 'Dr. Lee (Respiratory)', 'Dr. Wong (General Practice)'].includes(location.state.doctor) && (
                    <option>{location.state.doctor}</option>
                  )}
                  <option>Dr. Smith (Cardiology)</option>
                  <option>Dr. Jane Smith (Cardiology)</option>
                  <option>Dr. John Adams (Neurology)</option>
                  <option>Dr. Adams (Neurology)</option>
                  <option>Dr. Alan Lee (Respiratory)</option>
                  <option>Dr. Lee (Respiratory)</option>
                  <option>Dr. Sarah Wong (General Practice)</option>
                  <option>Dr. Wong (General)</option>
                </select>
              </div>

              <div className="input-group">
                <label>Date</label>
                <input type="date" required min={new Date().toISOString().split('T')[0]} value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>

              <div className="input-group">
                <label>Time</label>
                <input type="time" required value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
              </div>

              {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #ef4444', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem' }}>
                  <p style={{ color: '#b91c1c', margin: '0 0 0.5rem 0', fontSize: '0.9rem', fontWeight: 600 }}>{error}</p>
                  {suggestions.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.8rem', color: '#7f1d1d', width: '100%', marginBottom: '0.2rem' }}>Available slots:</span>
                      {suggestions.map(s => (
                        <button key={s} type="button" onClick={() => { setFormData({...formData, time: s}); setError(null); }} style={{ padding: '0.3rem 0.6rem', background: 'white', border: '1px solid #fecaca', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', color: '#991b1b' }}>{s}</button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <button type="submit" className="primary-btn" disabled={loading}>
                {loading && <div className="loader-spinner"></div>}
                {loading ? ' Booking...' : 'Confirm Appointment'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
