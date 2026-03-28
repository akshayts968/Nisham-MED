import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const CardLogin = () => {
  const [status, setStatus] = useState('Waiting for scanner...');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Connect to the server
    const socket = io(process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000');

    socket.on('connect', () => {
      setStatus('🟢 Connected! Tap your badge on the device.');
    });

    socket.on('disconnect', () => {
      setStatus('🔴 Disconnected from server.');
    });

    // 2. Listen for the magic login token!
    socket.on('login_success', (data) => {
      setStatus('✅ Login successful! Redirecting...');
      
      // Save the auth data
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.user.id);
      
      // Boom, route them to the dashboard
      setTimeout(() => navigate('/dashboard'), 1000); 
    });

    // 3. Listen for unrecognized cards
    socket.on('login_error', (data) => {
      setError(data.error);
      setTimeout(() => setError(''), 4000); // Clear error after 4 seconds
    });

    // Cleanup
    return () => socket.disconnect();
  }, [navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: '80px', fontFamily: 'sans-serif' }}>
      <h2>🏥 Hardware Badge Login</h2>
      <p style={{ color: '#666' }}>{status}</p>
      
      <div style={{ 
          width: '250px', height: '250px', border: '3px dashed #007bff', borderRadius: '20px',
          margin: '30px auto', display: 'flex', flexDirection: 'column', alignItems: 'center', 
          justifyContent: 'center', backgroundColor: '#f8f9fa'
        }}>
        <span style={{ fontSize: '60px', marginBottom: '10px', animation: 'pulse 2s infinite' }}>📡</span>
        <h3 style={{ margin: 0, color: '#007bff' }}>Listening...</h3>
      </div>

      {error && (
        <div style={{ color: '#721c24', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '5px', display: 'inline-block' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      <br /><br />
      <button 
        onClick={() => navigate('/login')}
        style={{ padding: '10px 20px', fontSize: '16px', background: 'transparent', border: '1px solid #ccc', borderRadius: '5px', cursor: 'pointer' }}>
        Back to Email Login
      </button>
    </div>
  );
};

export default CardLogin;