import React, { useState } from 'react';
import Login from './Main/Login/Login';
import Signup from './Main/Signup/Signup';
import Dashboard from './Main/Dashboard/Dashboard';
import Diagnosis from './Main/Dashboard/Diagnosis/Diagnosis';
import Cardiology from './Main/Dashboard/Diagnosis/Cardiology/Cardiology';
import MedicalHistory from './Main/Dashboard/Diagnosis/Cardiology/MedicalHistory/MedicalHistory';
import ClinicalData from './Main/Dashboard/Diagnosis/Cardiology/ClinicalData/ClinicalData';
import SensorData from './Main/Dashboard/Diagnosis/Cardiology/SensorData/SensorData';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Symptom from './Main/Dashboard/Diagnosis/Cardiology/Symptom/Sympton';
import ProtectedRoute from './ProtectedRoute'; 
import CardLogin from './Main/Login/Card';
import LiveEcgMonitor from './Main/Dashboard/Diagnosis/Cardiology/SensorData/LiveEcgMonitor';
export default function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route 
            path="/dashboard" 
            element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
          />
          <Route 
            path="/dashboard/diagnosis" 
            element={<ProtectedRoute><Diagnosis /></ProtectedRoute>} 
          />
          <Route 
            path="/dashboard/diagnosis/cardiology" 
            element={<ProtectedRoute><Cardiology /></ProtectedRoute>} 
          />
          <Route 
            path="/dashboard/diagnosis/cardiology/medical-history" 
            element={<ProtectedRoute><MedicalHistory /></ProtectedRoute>} 
          />
          <Route 
            path="/dashboard/diagnosis/cardiology/clinical-data" 
            element={<ProtectedRoute><ClinicalData /></ProtectedRoute>} 
          />
          <Route 
            path="/dashboard/diagnosis/cardiology/sensor-data" 
            element={<ProtectedRoute><SensorData /></ProtectedRoute>} 
          />
          <Route 
            path="/dashboard/diagnosis/cardiology/lifestyle-data" 
            element={<ProtectedRoute><Symptom /></ProtectedRoute>} 
          />
          <Route path="/card-login" element={<CardLogin />} />
          <Route path="/card" element={<LiveEcgMonitor />} />
        </Routes>
      </div>
    </Router>
  );
}