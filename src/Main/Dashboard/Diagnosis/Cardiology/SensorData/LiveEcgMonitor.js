import React, { useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';

const LiveEcgMonitor = () => {
  const [prediction, setPrediction] = useState("Waiting for 10 seconds of data...");
  const [confidence, setConfidence] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  
  const canvasRef = useRef(null);
  const xPosRef = useRef(0);
  const socketRef = useRef(null);

  useEffect(() => {
    // 1. Connect to your Flask SocketIO Server
    socketRef.current = io(process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000');

    socketRef.current.on('connect', () => setIsConnected(true));
    socketRef.current.on('disconnect', () => setIsConnected(false));

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Draw medical grid background
    const drawGrid = () => {
      ctx.fillStyle = '#f0f8ff'; // Very light blue background
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 20) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke(); }
      for (let i = 0; i < canvas.height; i += 20) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke(); }
    };

    drawGrid();
    ctx.strokeStyle = '#dc3545'; // Red ECG Line
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);

    // 2. Listen for Live Data from ESP32 -> Flask
    socketRef.current.on('react_live_ecg', (data) => {
      // Scale the ESP32 voltage (0-4095) to fit the React Canvas height
      const scaledY = canvas.height - (data.voltage / 4095) * canvas.height;
      
      xPosRef.current += 2; // Move the line to the right

      // Wrap around the screen when it hits the edge
      if (xPosRef.current > canvas.width) {
        xPosRef.current = 0;
        drawGrid(); // Clear the screen
        ctx.strokeStyle = '#dc3545';
        ctx.beginPath();
        ctx.moveTo(xPosRef.current, scaledY);
      }

      ctx.lineTo(xPosRef.current, scaledY);
      ctx.stroke();
    });

    // 3. Listen for the Deep Learning Prediction!
    socketRef.current.on('prediction_result', (data) => {
      setPrediction(data.diagnosis);
      setConfidence(data.confidence);
    });

    // Cleanup when leaving the page
    return () => socketRef.current.disconnect();
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>📈 Live Wireless ECG</h2>
        <span style={{ padding: '8px 15px', borderRadius: '20px', backgroundColor: isConnected ? '#d4edda' : '#f8d7da', color: isConnected ? '#155724' : '#721c24', fontWeight: 'bold' }}>
          {isConnected ? '🟢 Server Connected' : '🔴 Server Offline'}
        </span>
      </div>

      {/* The Medical Graph */}
      <div style={{ border: '3px solid #333', borderRadius: '10px', overflow: 'hidden', marginBottom: '20px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <canvas ref={canvasRef} width={750} height={250} style={{ display: 'block', width: '100%' }} />
      </div>

      {/* ML Prediction Box */}
      <div style={{ padding: '20px', backgroundColor: '#e9ecef', borderRadius: '8px', borderLeft: '6px solid #007bff', textAlign: 'left' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>🤖 Deep Learning Analysis</h3>
        <p style={{ margin: '5px 0', fontSize: '20px' }}>Diagnosis: <strong>{prediction}</strong></p>
        {confidence && <p style={{ margin: '5px 0', color: '#666' }}>AI Confidence Level: {confidence}%</p>}
      </div>
    </div>
  );
};

export default LiveEcgMonitor;