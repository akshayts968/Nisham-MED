import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client'; // <-- Make sure this is imported!
import '../ClinicalData/ClinicalData.css';
import './SensorData.css';

const SensorData = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // File Upload State
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileObject, setFileObject] = useState(null);
  const [fileResult, setFileResult] = useState(null); // For WFDB results

  // Live Wireless Sensor State
  const [isConnected, setIsConnected] = useState(false);
  const [livePrediction, setLivePrediction] = useState(null);
  
  const canvasRef = useRef(null);
  const xPosRef = useRef(0);
  const socketRef = useRef(null);

  // ==========================================
  // --- REAL-TIME WEBSOCKET LISTENER ---
  // ==========================================
  useEffect(() => {
    // 1. Connect to Flask WebSockets
    socketRef.current = io(process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000');

    socketRef.current.on('connect', () => setIsConnected(true));
    socketRef.current.on('disconnect', () => setIsConnected(false));

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      
      // Draw grid
      const drawGrid = () => {
        ctx.fillStyle = '#0b0c10'; // Dark theme matching your CSS
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#1f2833';
        ctx.lineWidth = 1;
        for (let i = 0; i < canvas.width; i += 20) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke(); }
        for (let i = 0; i < canvas.height; i += 20) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke(); }
      };

      drawGrid();
      ctx.strokeStyle = '#ef4444'; // Red ECG Line
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);

      // 2. Listen for Live Data from ESP32
      socketRef.current.on('react_live_ecg', (data) => {
        const scaledY = canvas.height - (data.voltage / 4095) * canvas.height;
        xPosRef.current += 2; 

        if (xPosRef.current > canvas.width) {
          xPosRef.current = 0;
          drawGrid();
          ctx.strokeStyle = '#ef4444';
          ctx.beginPath();
          ctx.moveTo(xPosRef.current, scaledY);
        }

        ctx.lineTo(xPosRef.current, scaledY);
        ctx.stroke();
      });

      // 3. Listen for the ML AI Prediction
      socketRef.current.on('prediction_result', (data) => {
        setLivePrediction(`✓ Live Diagnosis: ${data.diagnosis} (${data.confidence}% match)`);
      });
    }

    // Cleanup on unmount
    return () => socketRef.current.disconnect();
  }, []);

  // ==========================================
  // --- UPLOAD WFDB (.dat & .hea) LOGIC ---
  // ==========================================
  const handleUploadClick = () => fileInputRef.current.click();
  
  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    const datFile = files.find(f => f.name.endsWith('.dat'));
    const heaFile = files.find(f => f.name.endsWith('.hea'));

    if (!datFile || !heaFile) {
      alert("Please select BOTH the .dat and .hea files at the same time.");
      return;
    }

    const baseName = datFile.name.replace('.dat', '');
    setSelectedFile(`${baseName} (.dat & .hea)`);
    setFileObject(true); 
    setFileResult("Analyzing WFDB records on server...");

    const formData = new FormData();
    formData.append('dat', datFile);
    formData.append('hea', heaFile);
    
    // Grab the actual user ID from localStorage
    formData.append('userId', localStorage.getItem('userId') || 'guest');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/analyze-wfdb`, {
        method: 'POST',
        body: formData, 
      });

      const mlResult = await response.json();
      
      if (response.ok) {
          const confidencePct = (mlResult.confidence * 100).toFixed(1);
          setFileResult(`✓ File Diagnosis: ${mlResult.diagnosis} (${confidencePct}% match)`);
      } else {
          setFileResult(`Analysis failed: ${mlResult.error}`);
      }
    } catch (postError) {
      console.error("Backend Error:", postError);
      setFileResult("Server connection error. Is Flask running?");
    }
  };

  const handleSaveAndExit = async () => {
    if (!fileObject && !livePrediction) {
      navigate('/dashboard');
      return;
    }
    alert("Data saved successfully!");
    navigate('/dashboard');
  };

  return (
    <div className="clinical-data-wrapper">
      <div className="top-nav-bar">
        <button className="back-arrow" onClick={() => navigate('/dashboard/diagnosis/cardiology')}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <h1 className="nav-title">Sensor / Wearable Data</h1>
      </div>

      <div className="clinical-data-content">
        
        {/* ======================================= */}
        {/* SECTION 1: LIVE WIRELESS ECG MONITOR    */}
        {/* ======================================= */}
        <div className="upload-card" style={{ marginBottom: '24px' }}>
          <div className="upload-header" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="upload-icon">❤️</span> 
              <h2 className="upload-title">Live Wireless ECG</h2>
            </div>
            <span style={{ fontSize: '14px', color: isConnected ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>
              {isConnected ? '🟢 Server Online' : '🔴 Server Offline'}
            </span>
          </div>
          
          <p style={{ textAlign: 'center', color: '#666', fontSize: '14px', marginBottom: '15px' }}>
            Ensure device is powered on. Tap patient RFID card on the scanner to begin the live feed.
          </p>

          <div className="sensor-display" style={{ padding: '0', overflow: 'hidden', background: '#0b0c10' }}>
            {/* The real-time Canvas replaces the static SVG animation */}
            <canvas 
              ref={canvasRef} 
              width={600} 
              height={150} 
              style={{ display: 'block', width: '100%', borderRadius: '8px' }}
            />
          </div>

          <div style={{ marginTop: '15px', minHeight: '30px' }}>
            {livePrediction ? (
              <p style={{ color: '#14a098', fontWeight: '600', textAlign: 'center', margin: 0, fontSize: '18px' }}>
                {livePrediction}
              </p>
            ) : (
              <p style={{ color: '#9ca3af', textAlign: 'center', margin: 0 }}>
                Waiting for data stream... (Requires 10s for AI Analysis)
              </p>
            )}
          </div>
        </div>

        {/* ======================================= */}
        {/* SECTION 2: UPLOAD PAST ECG (WFDB)       */}
        {/* ======================================= */}
        <div className="upload-card">
          <div className="upload-header">
            <span className="upload-icon">🗂️</span> 
            <h2 className="upload-title">Upload Past ECG</h2>
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
            accept=".dat,.hea" 
            multiple 
          />
          
          <button className="upload-btn" onClick={handleUploadClick}>
            {selectedFile ? 'Change Files' : 'Upload WFDB Files'}
          </button>
          
          {selectedFile && <p style={{ marginTop: '16px', color: '#14a098', fontWeight: '600', textAlign: 'center' }}>✓ {selectedFile}</p>}
          {fileResult && <p style={{ marginTop: '8px', color: fileResult.includes('failed') ? '#ef4444' : '#14a098', fontWeight: 'bold', textAlign: 'center' }}>{fileResult}</p>}
        </div>

        <div className="save-btn-container">
          <button className="save-btn" onClick={handleSaveAndExit}>Save and exit</button>
        </div>

      </div>
    </div>
  );
};

export default SensorData;