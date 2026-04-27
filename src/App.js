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
import Profile from './Main/Dashboard/Profile/Profile';
import Neurology from './Main/Dashboard/Diagnosis/Neurology/Neurology';
import Respiratory from './Main/Dashboard/Diagnosis/Respiratory/Respiratory';
import Spirometry from './Main/Dashboard/Diagnosis/Respiratory/Spirometry/Spirometry';
import Cognitive from './Main/Dashboard/Diagnosis/Neurology/Cognitive/Cognitive';
import PlaceholderPage from './Main/Dashboard/Placeholder/PlaceholderPage';
import BookAppointment from './Main/Dashboard/Features/components/BookAppointment';
import AppointmentList from './Main/Dashboard/Features/components/AppointmentList';
import CallAppointment from './Main/Dashboard/Features/components/CallAppointment';
import FindDoctor from './Main/Dashboard/Features/components/FindDoctor';
import LabReports from './Main/Dashboard/Features/components/LabReports';
import UploadDocuments from './Main/Dashboard/Features/components/UploadDocuments';
import DocumentGallery from './Main/Dashboard/Features/components/DocumentGallery';
import ContactUs from './Main/Dashboard/Features/components/ContactUs';
import AboutUs from './Main/Dashboard/Features/components/AboutUs';

export default function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route 
            path="/dashboard" 
            element={<Dashboard />} 
          />
          <Route 
            path="/dashboard/profile" 
            element={<ProtectedRoute><Profile /></ProtectedRoute>} 
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
          <Route 
            path="/dashboard/diagnosis/neurology" 
            element={<ProtectedRoute><Neurology /></ProtectedRoute>} 
          />
          <Route 
            path="/dashboard/diagnosis/respiratory" 
            element={<ProtectedRoute><Respiratory /></ProtectedRoute>} 
          />
          <Route 
            path="/dashboard/diagnosis/respiratory/spirometry" 
            element={<ProtectedRoute><Spirometry /></ProtectedRoute>} 
          />
          <Route 
            path="/dashboard/diagnosis/neurology/cognitive" 
            element={<ProtectedRoute><Cognitive /></ProtectedRoute>} 
          />
          <Route path="/dashboard/book-appointment" element={<BookAppointment />} />
          <Route path="/dashboard/appointment-list" element={<AppointmentList />} />
          <Route path="/dashboard/find-doctor" element={<FindDoctor />} />
          <Route path="/dashboard/call-appointment" element={<CallAppointment />} />
          <Route path="/dashboard/upload-documents" element={<ProtectedRoute><UploadDocuments /></ProtectedRoute>} />
          <Route path="/dashboard/documents" element={<ProtectedRoute><DocumentGallery /></ProtectedRoute>} />
          <Route path="/dashboard/lab-reports" element={<ProtectedRoute><LabReports /></ProtectedRoute>} />
          <Route path="/dashboard/contact-us" element={<ContactUs />} />
          <Route path="/dashboard/about-us" element={<AboutUs />} />

          <Route path="/card-login" element={<CardLogin />} />
          <Route path="/card" element={<LiveEcgMonitor />} />
        </Routes>
      </div>
    </Router>
  );
}