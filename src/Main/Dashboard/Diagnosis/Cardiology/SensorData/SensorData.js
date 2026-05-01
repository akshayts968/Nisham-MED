import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import '../ClinicalData/ClinicalData.css';
import './SensorData.css';

const SensorData = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // File Upload State
  const [selectedFile, setSelectedFile] = useState(null);

  // Live Wireless Sensor State
  const [isConnected, setIsConnected] = useState(false);
  
  const canvasRef = useRef(null);
  const xPosRef = useRef(0);
  const socketRef = useRef(null);

  // ==========================================
  // --- UNIFIED PREDICTION STATE ---
  // ==========================================
  const ecgResultRef = useRef(null); 
  
  // New unified state to display ECG results beautifully in the final card
  const [ecgReport, setEcgReport] = useState(null); 
  
  const [bloodPrediction, setBloodPrediction] = useState(null);
  const [fetchedBloodData, setFetchedBloodData] = useState(null); 
  const [isPredictingBlood, setIsPredictingBlood] = useState(false);
  const [finalPrediction, setFinalPrediction] = useState(null);

  // ==========================================
  // --- REAL-TIME WEBSOCKET LISTENER ---
  // ==========================================
  useEffect(() => {
    socketRef.current = io(process.env.REACT_APP_FLASK_URL || 'http://localhost:5001');

    socketRef.current.on('connect', () => setIsConnected(true));
    socketRef.current.on('disconnect', () => setIsConnected(false));

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      
      const drawGrid = () => {
        ctx.fillStyle = '#0b0c10'; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#1f2833';
        ctx.lineWidth = 1;
        for (let i = 0; i < canvas.width; i += 20) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke(); }
        for (let i = 0; i < canvas.height; i += 20) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke(); }
      };

      drawGrid();
      ctx.strokeStyle = '#ef4444'; 
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);

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

      // --- TRIGGER 1: AUTOMATIC BLOOD ANALYSIS AFTER LIVE ECG ---
      socketRef.current.on('prediction_result', async (data) => {
        ecgResultRef.current = { diagnosis: data.diagnosis, confidence: data.confidence };
        
        // Save ECG report to display in the bottom card
        setEcgReport({
          source: 'Live Wireless Stream',
          diagnosis: data.diagnosis,
          confidence: data.confidence
        });
        
        setIsPredictingBlood(true);
        setBloodPrediction(null); 
        setFetchedBloodData(null);
        setFinalPrediction(null);

        try {
          const response = await fetch(`${process.env.REACT_APP_FLASK_URL}/api/analyze-blood`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: localStorage.getItem('userId') || 'guest' })
          });

          const result = await response.json();

          if (response.ok) {
            setFetchedBloodData(result.biomarkers); 
            setBloodPrediction(`Diagnosis: ${result.diagnosis} (${result.confidence}% match)`);
            calculateEnsemblePrediction(result.diagnosis, result.confidence);
          } else {
            setBloodPrediction(`❌ Error: ${result.error}`);
          }
        } catch (error) {
          setBloodPrediction("❌ Server connection failed. Is Flask running?");
        } finally {
          setIsPredictingBlood(false);
        }
      });
    }

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

    
    // Clear previous reports when starting a new file analysis
    setEcgReport({ source: 'Uploaded WFDB File', diagnosis: 'Analyzing...', confidence: '--' });
    setBloodPrediction(null);
    setFetchedBloodData(null);
    setFinalPrediction(null);

    const formData = new FormData();
    formData.append('dat', datFile);
    formData.append('hea', heaFile);
    formData.append('userId', localStorage.getItem('userId') || 'guest');

    try {
      const response = await fetch(`${process.env.REACT_APP_FLASK_URL}/api/analyze-wfdb`, {
        method: 'POST',
        body: formData, 
      });

      const mlResult = await response.json();
      
      if (response.ok) {
          // Normalize confidence format
          let conf = parseFloat(mlResult.confidence);
          if (conf <= 1.0) conf = conf * 100; // Convert 0.85 to 85.0
          const confidencePct = conf.toFixed(1);
          
          ecgResultRef.current = { diagnosis: mlResult.diagnosis, confidence: confidencePct };
          
          // Update the ECG report UI
          setEcgReport({
            source: 'Uploaded WFDB File',
            diagnosis: mlResult.diagnosis,
            confidence: confidencePct
          });
          
          // --- TRIGGER 2: AUTOMATIC BLOOD ANALYSIS AFTER FILE UPLOAD ---
          setIsPredictingBlood(true);

          try {
            const bloodResponse = await fetch(`${process.env.REACT_APP_FLASK_URL}/api/analyze-blood`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: localStorage.getItem('userId') || 'guest' })
            });

            const bloodResult = await bloodResponse.json();

            if (bloodResponse.ok) {
              setFetchedBloodData(bloodResult.biomarkers); 
              setBloodPrediction(`Diagnosis: ${bloodResult.diagnosis} (${bloodResult.confidence}% match)`);
              calculateEnsemblePrediction(bloodResult.diagnosis, bloodResult.confidence);
            } else {
              setBloodPrediction(`❌ Error: ${bloodResult.error}`);
            }
          } catch (error) {
            setBloodPrediction("❌ Server connection failed. Is Flask running?");
          } finally {
            setIsPredictingBlood(false);
          }

      } else {
          setEcgReport({ source: 'Uploaded WFDB File', diagnosis: `Analysis Failed: ${mlResult.error}`, confidence: '0' });
      }
    } catch (postError) {
      console.error("Backend Error:", postError);
      setEcgReport({ source: 'Uploaded WFDB File', diagnosis: 'Server Connection Error', confidence: '0' });
    }
  };

  // ==========================================
  // --- ENSEMBLE AI (THE AVERAGING LOGIC) ---
  // ==========================================
  const calculateEnsemblePrediction = (bloodDiag, bloodConf) => {
    if (ecgResultRef.current) {
      const ecgConf = parseFloat(ecgResultRef.current.confidence) || 0;
      const bConf = parseFloat(bloodConf) || 0;
      
      const avgConfidence = ((ecgConf + bConf) / 2).toFixed(1);
      
      const d1 = ecgResultRef.current.diagnosis.toLowerCase();
      const d2 = bloodDiag.toLowerCase();
      const hasRisk = d1.includes('infarction') || d1.includes('abnormal') || d2.includes('high risk');
      
      const finalDiagnosisString = hasRisk ? "High Risk - Myocardial Infarction" : "Normal Sinus Rhythm & Blood Vitals";
      
      setFinalPrediction(`Overall Patient Status: ${finalDiagnosisString} (${avgConfidence}% certainty)`);
    }
  };

  const handleSaveAndExit = async () => {
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
        <h1 className="nav-title">Sensor & Clinical Data</h1>
      </div>

      <div className="clinical-data-content">
        
        {/* SECTION 1: LIVE WIRELESS ECG MONITOR */}
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
            <canvas 
              ref={canvasRef} 
              width={600} 
              height={150} 
              style={{ display: 'block', width: '100%', borderRadius: '8px' }}
            />
          </div>

          <div style={{ marginTop: '15px', minHeight: '30px' }}>
            {ecgReport && ecgReport.source.includes('Live') ? (
              <p style={{ color: '#14a098', fontWeight: '600', textAlign: 'center', margin: 0, fontSize: '16px' }}>
                ✓ Stream Complete. Generating final report...
              </p>
            ) : (
              <p style={{ color: '#9ca3af', textAlign: 'center', margin: 0 }}>
                Waiting for data stream... (Requires 10s for AI Analysis)
              </p>
            )}
          </div>
        </div>

        {/* SECTION 2: UPLOAD PAST ECG (WFDB) */}
        <div className="upload-card" style={{ marginBottom: '24px' }}>
          <div className="upload-header">
            <span className="upload-icon">🗂️</span> 
            <h2 className="upload-title">Upload Past ECG</h2>
          </div>
          
          <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '14px', marginTop: '5px', marginBottom: '15px' }}>
            Select both .dat and .hea files simultaneously.
          </p>

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
          
          {selectedFile && <p style={{ marginTop: '16px', color: '#14a098', fontWeight: '600', textAlign: 'center' }}>✓ {selectedFile} Uploaded</p>}
        </div>

        {/* ======================================= */}
        {/* SECTION 3: UNIFIED AI ANALYSIS OUTPUT   */}
        {/* ======================================= */}
        {ecgReport && (
          <div className="upload-card" style={{ marginBottom: '24px', borderTop: '4px solid #38bdf8' }}>
            <div className="upload-header" style={{ borderBottom: '1px solid #334155', paddingBottom: '10px', marginBottom: '15px' }}>
              <span className="upload-icon">🧠</span> 
              <h2 className="upload-title">Comprehensive AI Analysis</h2>
            </div>

            {/* --- STEP 1: ECG RESULT --- */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ color: '#bae6fd', fontSize: '15px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                1. ECG Analysis ({ecgReport.source})
              </h3>
              <p style={{ margin: 0, color: '#e2e8f0', fontSize: '16px', background: '#1e293b', padding: '10px', borderRadius: '6px' }}>
                <strong>Diagnosis:</strong> {ecgReport.diagnosis} <span style={{ color: '#34d399', float: 'right' }}>{ecgReport.confidence}% match</span>
              </p>
            </div>
            
            {/* --- STEP 2: BLOOD FETCHING LOADER --- */}
            {isPredictingBlood && !bloodPrediction && (
              <p style={{ textAlign: 'center', color: '#0ea5e9', fontWeight: 'bold', margin: '20px 0' }}>
                Fetching Blood Biomarkers from Database & Analyzing...
              </p>
            )}

            {/* --- STEP 3: BLOOD NUMBERS & RESULT --- */}
            {fetchedBloodData && (
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: '#bae6fd', fontSize: '15px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  2. Blood Biomarker Analysis
                </h3>
                <div style={{ background: '#1e293b', padding: '12px', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', fontSize: '13px', color: '#e2e8f0', borderBottom: '1px solid #334155', paddingBottom: '10px', marginBottom: '10px' }}>
                    <span><span style={{color: '#64748b'}}>Trop I:</span> <strong>{fetchedBloodData.troponin}</strong></span>
                    <span><span style={{color: '#64748b'}}>CK-MB:</span> <strong>{fetchedBloodData.ck_mb}</strong></span>
                    <span><span style={{color: '#64748b'}}>BNP:</span> <strong>{fetchedBloodData.bnp}</strong></span>
                    <span><span style={{color: '#64748b'}}>K+:</span> <strong>{fetchedBloodData.potassium}</strong></span>
                    <span><span style={{color: '#64748b'}}>Cr:</span> <strong>{fetchedBloodData.creatinine}</strong></span>
                  </div>
                  {bloodPrediction && (
                    <p style={{ color: bloodPrediction.includes('❌') ? '#f87171' : '#e2e8f0', fontSize: '16px', margin: 0 }}>
                      <strong>{bloodPrediction.split('(')[0]}</strong> <span style={{ color: '#34d399', float: 'right' }}>({bloodPrediction.split('(')[1]}</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* --- STEP 4: FINAL ENSEMBLE RESULT --- */}
            {finalPrediction && (
              <div style={{ marginTop: '20px', padding: '16px', border: '2px solid #f59e0b', background: '#0f172a', borderRadius: '8px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: finalPrediction.includes('Normal') ? '#34d399' : '#f87171' }}></div>
                <h3 style={{ color: '#fbbf24', fontSize: '16px', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  3. Final Ensemble Assessment
                </h3>
                <p style={{ 
                  fontSize: '20px', 
                  fontWeight: 'bold', 
                  color: finalPrediction.includes('Normal') ? '#34d399' : '#f87171', 
                  margin: '0'
                }}>
                  {finalPrediction}
                </p>
              </div>
            )}
          </div>
        )}
        
        <div className="save-btn-container">
          <button className="save-btn" onClick={handleSaveAndExit}>Exit to Dashboard</button>
        </div>

      </div>
    </div>
  );
};

export default SensorData;