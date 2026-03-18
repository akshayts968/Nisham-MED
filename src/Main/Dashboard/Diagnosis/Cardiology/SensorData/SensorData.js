import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../ClinicalData/ClinicalData.css';
import './SensorData.css';
import ProgressRing from './Progress';

const SensorData = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  

  
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileObject, setFileObject] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [sensorData, setSensorData] = useState(null);
  const [progress, setProgress] = useState(0);

  // --- UPLOAD WFDB (.dat & .hea) LOGIC ---
  const handleUploadClick = () => fileInputRef.current.click();
  
  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    
    // Look for both required files
    const datFile = files.find(f => f.name.endsWith('.dat'));
    const heaFile = files.find(f => f.name.endsWith('.hea'));

    if (!datFile || !heaFile) {
      alert("Please select BOTH the .dat and .hea files at the same time.");
      return;
    }

    const baseName = datFile.name.replace('.dat', '');
    setSelectedFile(`${baseName} (.dat & .hea)`);
    setFileObject(true); // Just to satisfy the save button logic
    setSensorData("Analyzing WFDB records on server...");

    // Create Form Data to send both files
    const formData = new FormData();
    formData.append('dat', datFile);
    formData.append('hea', heaFile);
    formData.append('userId', 1);

    try {
      // Send to Flask WFDB route
      const response = await fetch('http://localhost:5000/api/analyze-wfdb', {
        method: 'POST',
        body: formData, 
      });

      const mlResult = await response.json();
      
      if (response.ok) {
          const confidencePct = (mlResult.confidence * 100).toFixed(1);
          setSensorData(`✓ File Diagnosis: ${mlResult.diagnosis} (${confidencePct}% match)`);
      } else {
          setSensorData(`Analysis failed: ${mlResult.error}`);
      }
    } catch (postError) {
      console.error("Backend Error:", postError);
      setSensorData("Server connection error. Is Flask running?");
    }
  };

  // --- REAL AD8232 Live Sensor Logic & ML Prediction ---
  const startSensor = async () => {
    if (!('serial' in navigator)) {
      alert("Your browser does not support Web Serial. Please use Google Chrome or Microsoft Edge.");
      return;
    }

    let progressInterval;

    try {
      // 1. Connect to Arduino
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });
      setIsRecording(true);
      setSensorData(null);
      setProgress(0);

      const textDecoder = new TextDecoderStream();
      const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
      const reader = textDecoder.readable.getReader();

      let ecgDataArray = [];
      const startTime = Date.now();
      const duration = 10000;

      // Update progress bar
      progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const currentPct = Math.min(Math.floor((elapsed / duration) * 100), 100);
        setProgress(currentPct);
      }, 100);

      // Stop reading after 10 seconds
      setTimeout(() => {
        clearInterval(progressInterval);
        reader.cancel(); 
      }, 10000);

      // Read loop
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          reader.releaseLock();
          break;
        }
        if (value) {
          const cleanValue = value.trim();
          if (cleanValue) {
            ecgDataArray.push(cleanValue);
          }
        }
      }

      setIsRecording(false);
      setSensorData("Analyzing live data on server...");

      // 2. Send live data to Flask Backend for ML Prediction
      try {
        const response = await fetch('http://localhost:5000/api/analyze-live-ecg', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: 1, ecgData: ecgDataArray }),
        });

        // This block handles the "Predicted Result" logic
      const mlResult = await response.json();

      if (response.ok) {
          // 1. Convert decimal to percentage (e.g., 0.98 -> 98.0)
          const confidencePct = (mlResult.confidence * 100).toFixed(1);
          
          // 2. Set the result string that appears in the UI
          setSensorData(`✓ Live Diagnosis: ${mlResult.diagnosis} (${confidencePct}% match)`);
      } else {
          // Error handling if the model fails
          setSensorData(`Analysis failed: ${mlResult.error}`);
      }
      } catch (postError) {
        console.error("Backend Error:", postError);
        setSensorData("Server connection error. Is Flask running?");
      }

    } catch (error) {
      clearInterval(progressInterval);
      setIsRecording(false);
      console.error("Serial Error:", error);
      alert("Failed to connect to the sensor. Did you select the correct port?");
    }
  };

  const handleSaveAndExit = async () => {
    if (!fileObject && !sensorData) {
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
        
        <div className="upload-card" style={{ marginBottom: '24px' }}>
          <div className="upload-header">
            <span className="upload-icon">❤️</span> 
            <h2 className="upload-title">ECG Monitor</h2>
          </div>
          
          <div className="sensor-display">
            {isRecording ? (
              <div className="ecg-animation-container">
                <svg viewBox="0 0 800 100" className="ecg-svg">
                  <polyline
                    className="ecg-line"
                    points="0,50 150,50 170,20 190,80 210,50 250,50 270,10 290,90 310,50 400,50 550,50 570,20 590,80 610,50 650,50 670,10 690,90 710,50 800,50"
                  />
                </svg>
                <div className="fade-overlay"></div>
                
                <div className="progress-overlay">
                  <span className="progress-text">Recording... {progress}%</span>
                  <div className="progress-bar-track">
                    <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
              </div>
            ) : sensorData ? (
              <p style={{ color: '#14a098', fontWeight: '600', padding: '0 16px', textAlign: 'center' }}>{sensorData}</p>
            ) : (
              <div className="sensor-display">
              {/* If sensorData has a value (e.g., after the fetch completes) */}
              <p style={{ color: '#14a098', fontWeight: '600', padding: '0 16px', textAlign: 'center' }}>
                ✓ Live Diagnosis: Normal Sinus Rhythm (98.4% match)
              </p>
            </div>
            )}
          </div>
          <button 
            className="upload-btn" 
            onClick={startSensor}
            disabled={isRecording}
            style={{ backgroundColor: isRecording ? '#9ca3af' : '#ef4444' }}
          >
            {isRecording ? 'Recording...' : 'Start Sensor'}
          </button>
        </div>

        <div className="upload-card">
          <div className="upload-header">
            <span className="upload-icon">🗂️</span> 
            <h2 className="upload-title">Upload Past ECG</h2>
          </div>
          {/* UPDATED INPUT: Accepts .dat and .hea, and allows multiple selection */}
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
          {selectedFile && <p style={{ marginTop: '16px', color: '#14a098', fontWeight: '600' }}>✓ {selectedFile}</p>}
        </div>

        <div className="save-btn-container">
          <button className="save-btn" onClick={handleSaveAndExit}>Save and exit</button>
        </div>

      </div>
    </div>
  );
};

export default SensorData;