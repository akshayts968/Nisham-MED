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
  const [fileObject, setFileObject] = useState(null);
  const [fileResult, setFileResult] = useState(null);

  // Live Wireless Sensor State
  const [isConnected, setIsConnected] = useState(false);
  const [livePrediction, setLivePrediction] = useState(null);
  
  const canvasRef = useRef(null);
  const xPosRef = useRef(0);
  const socketRef = useRef(null);

  // ==========================================
  // --- COMBINED PREDICTION STATE & REFS ---
  // ==========================================
  const [bloodData, setBloodData] = useState({
    Troponin_I_ng_mL: '',
    CK_MB_ng_mL: '',
    BNP_pg_mL: '',
    Potassium_mEq_L: '',
    Creatinine_mg_dL: ''
  });
  
  const bloodDataRef = useRef(bloodData);
  const ecgResultRef = useRef(null); // <-- NEW: Saves the ECG result to average later
  
  const [bloodPrediction, setBloodPrediction] = useState(null);
  const [isPredictingBlood, setIsPredictingBlood] = useState(false);
  
  const [finalPrediction, setFinalPrediction] = useState(null); // <-- NEW: The averaged result

  // ==========================================
  // --- REAL-TIME WEBSOCKET LISTENER ---
  // ==========================================
  useEffect(() => {
    socketRef.current = io(process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000');

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
        // Save the ECG result to our secret Ref for averaging later
        ecgResultRef.current = { diagnosis: data.diagnosis, confidence: data.confidence };
        
        setLivePrediction(`✓ Live Diagnosis: ${data.diagnosis} (${data.confidence}% match). Auto-saved.`);
        
        setIsPredictingBlood(true);
        setBloodPrediction("Live ECG complete. Analyzing blood biomarkers...");

        try {
          const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/analyze-blood`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: localStorage.getItem('userId') || 'guest',
              Troponin_I_ng_mL: parseFloat(bloodDataRef.current.Troponin_I_ng_mL) || 0,
              CK_MB_ng_mL: parseFloat(bloodDataRef.current.CK_MB_ng_mL) || 0,
              BNP_pg_mL: parseFloat(bloodDataRef.current.BNP_pg_mL) || 0,
              Potassium_mEq_L: parseFloat(bloodDataRef.current.Potassium_mEq_L) || 0,
              Creatinine_mg_dL: parseFloat(bloodDataRef.current.Creatinine_mg_dL) || 0
            })
          });

          const result = await response.json();

          if (response.ok) {
            setBloodPrediction(`✓ Blood Diagnosis: ${result.diagnosis} (${result.confidence}% match). Auto-saved!`);
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
    setFileObject(true); 
    setFileResult("Analyzing WFDB records on server...");

    const formData = new FormData();
    formData.append('dat', datFile);
    formData.append('hea', heaFile);
    formData.append('userId', localStorage.getItem('userId') || 'guest');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/analyze-wfdb`, {
        method: 'POST',
        body: formData, 
      });

      const mlResult = await response.json();
      
      if (response.ok) {
          const confidencePct = (mlResult.confidence * 100).toFixed(1);
          setFileResult(`✓ File Diagnosis: ${mlResult.diagnosis} (${confidencePct}% match). Auto-saved.`);
          
          // Save the ECG result to our secret Ref for averaging later
          ecgResultRef.current = { diagnosis: mlResult.diagnosis, confidence: confidencePct };
          
          // --- TRIGGER 2: AUTOMATIC BLOOD ANALYSIS AFTER FILE UPLOAD ---
          setIsPredictingBlood(true);
          setBloodPrediction("File analysis complete. Analyzing blood biomarkers...");

          try {
            const bloodResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/analyze-blood`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: localStorage.getItem('userId') || 'guest',
                Troponin_I_ng_mL: parseFloat(bloodDataRef.current.Troponin_I_ng_mL) || 0,
                CK_MB_ng_mL: parseFloat(bloodDataRef.current.CK_MB_ng_mL) || 0,
                BNP_pg_mL: parseFloat(bloodDataRef.current.BNP_pg_mL) || 0,
                Potassium_mEq_L: parseFloat(bloodDataRef.current.Potassium_mEq_L) || 0,
                Creatinine_mg_dL: parseFloat(bloodDataRef.current.Creatinine_mg_dL) || 0
              })
            });

            const bloodResult = await bloodResponse.json();

            if (bloodResponse.ok) {
              setBloodPrediction(`✓ Blood Diagnosis: ${bloodResult.diagnosis} (${bloodResult.confidence}% match). Auto-saved!`);
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
          setFileResult(`Analysis failed: ${mlResult.error}`);
      }
    } catch (postError) {
      console.error("Backend Error:", postError);
      setFileResult("Server connection error. Is Flask running?");
    }
  };

  // ==========================================
  // --- ENSEMBLE AI (THE AVERAGING LOGIC) ---
  // ==========================================
  const calculateEnsemblePrediction = (bloodDiag, bloodConf) => {
    if (ecgResultRef.current) {
      const ecgConf = parseFloat(ecgResultRef.current.confidence) || 0;
      const bConf = parseFloat(bloodConf) || 0;
      
      // Take the average of the two AI Models
      const avgConfidence = ((ecgConf + bConf) / 2).toFixed(1);
      
      // Determine final diagnosis (If EITHER model detects risk, we mark as High Risk)
      const d1 = ecgResultRef.current.diagnosis.toLowerCase();
      const d2 = bloodDiag.toLowerCase();
      const hasRisk = d1.includes('infarction') || d1.includes('abnormal') || d2.includes('high risk');
      
      const finalDiagnosisString = hasRisk ? "High Risk - Myocardial Infarction" : "Normal Sinus Rhythm & Blood Vitals";
      
      setFinalPrediction(`Overall Patient Status: ${finalDiagnosisString} (${avgConfidence}% certainty)`);
    }
  };

  const handleBloodInputChange = (e) => {
    setBloodData(prev => {
      const newData = { ...prev, [e.target.name]: e.target.value };
      bloodDataRef.current = newData; 
      return newData;
    });
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

        {/* SECTION 2: UPLOAD PAST ECG (WFDB) */}
        <div className="upload-card" style={{ marginBottom: '24px' }}>
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

        {/* ======================================= */}
        {/* SECTION 3: BLOOD BIOMARKERS             */}
        {/* ======================================= */}
        <div className="upload-card">
          <div className="upload-header">
            <span className="upload-icon">🩸</span> 
            <h2 className="upload-title">Blood Biomarkers</h2>
          </div>
          
          <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '14px', marginTop: '5px', marginBottom: '15px' }}>
            Fill in available biomarkers. Analysis will trigger <strong>automatically</strong> when a Live ECG or File Upload completes.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '10px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontSize: '15px', fontWeight: '600', letterSpacing: '0.5px' }}>Troponin I (ng/mL)</label>
              <input type="number" name="Troponin_I_ng_mL" value={bloodData.Troponin_I_ng_mL} onChange={handleBloodInputChange} 
                style={{ width: '100%', boxSizing: 'border-box', padding: '12px 15px', fontSize: '16px', borderRadius: '8px', border: '2px solid #64748b', background: '#1e293b', color: '#bae6fd', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)' }} />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontSize: '15px', fontWeight: '600', letterSpacing: '0.5px' }}>CK-MB (ng/mL)</label>
              <input type="number" name="CK_MB_ng_mL" value={bloodData.CK_MB_ng_mL} onChange={handleBloodInputChange} 
                style={{ width: '100%', boxSizing: 'border-box', padding: '12px 15px', fontSize: '16px', borderRadius: '8px', border: '2px solid #64748b', background: '#1e293b', color: '#bae6fd', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)' }} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontSize: '15px', fontWeight: '600', letterSpacing: '0.5px' }}>BNP (pg/mL)</label>
              <input type="number" name="BNP_pg_mL" value={bloodData.BNP_pg_mL} onChange={handleBloodInputChange} 
                style={{ width: '100%', boxSizing: 'border-box', padding: '12px 15px', fontSize: '16px', borderRadius: '8px', border: '2px solid #64748b', background: '#1e293b', color: '#bae6fd', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)' }} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontSize: '15px', fontWeight: '600', letterSpacing: '0.5px' }}>Potassium (mEq/L)</label>
              <input type="number" name="Potassium_mEq_L" value={bloodData.Potassium_mEq_L} onChange={handleBloodInputChange} 
                style={{ width: '100%', boxSizing: 'border-box', padding: '12px 15px', fontSize: '16px', borderRadius: '8px', border: '2px solid #64748b', background: '#1e293b', color: '#bae6fd', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)' }} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontSize: '15px', fontWeight: '600', letterSpacing: '0.5px' }}>Creatinine (mg/dL)</label>
              <input type="number" name="Creatinine_mg_dL" value={bloodData.Creatinine_mg_dL} onChange={handleBloodInputChange} 
                style={{ width: '100%', boxSizing: 'border-box', padding: '12px 15px', fontSize: '16px', borderRadius: '8px', border: '2px solid #64748b', background: '#1e293b', color: '#bae6fd', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)' }} />
            </div>
          </div>

          {bloodPrediction && (
            <div style={{ marginTop: '20px', padding: '16px', background: '#0f172a', borderRadius: '8px', border: '2px solid #38bdf8', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
              <p style={{ color: bloodPrediction.includes('❌') ? '#f87171' : '#34d399', fontSize: '16px', fontWeight: 'bold', textAlign: 'center', margin: 0, letterSpacing: '0.5px' }}>
                {bloodPrediction}
              </p>
            </div>
          )}
          
          {isPredictingBlood && !bloodPrediction && (
            <p style={{ textAlign: 'center', color: '#0ea5e9', fontWeight: 'bold', marginTop: '15px' }}>
              Analyzing Blood Biomarkers...
            </p>
          )}
        </div>

        {/* ======================================= */}
        {/* SECTION 4: THE FINAL ENSEMBLE SCORE     */}
        {/* ======================================= */}
        {finalPrediction && (
          <div className="upload-card" style={{ marginTop: '24px', border: '2px solid #f59e0b', background: '#1e293b' }}>
            <h2 className="upload-title" style={{ textAlign: 'center', color: '#fbbf24', fontSize: '20px' }}>
              🤖 Final Combined Assessment
            </h2>
            <p style={{ 
              textAlign: 'center', 
              fontSize: '18px', 
              fontWeight: 'bold', 
              color: finalPrediction.includes('Normal') ? '#34d399' : '#f87171', 
              marginTop: '15px',
              marginBottom: '5px'
            }}>
              {finalPrediction}
            </p>
            <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '13px', fontStyle: 'italic' }}>
              *Based on an ensemble average of ECG Data and Blood Biomarker inputs.
            </p>
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