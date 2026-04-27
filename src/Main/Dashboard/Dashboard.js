import React from 'react';
import { useNavigate } from 'react-router-dom';
import Carousel from '../../Help/AutoScroll';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const isGuest = !localStorage.getItem('token');

  // --- LOGOUT / LOGIN LOGIC ---
  const handleAuthAction = () => {
    if (isGuest) {
      navigate('/login');
    } else {
      // Clear the session tokens
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('role');
      navigate('/login');
    }
  };

  const menuItems = [
    { title: 'Profile', icon: '👤', route: '/dashboard/profile', private: true },
    { title: 'Diagnosis', icon: '🖥️', route: '/dashboard/diagnosis', private: true }, 
    { title: 'Book An\nAppointment', icon: '📅', route: '/dashboard/book-appointment' },
    { title: 'Appointment\nList', icon: '📋', route: '/dashboard/appointment-list' },
    { title: 'Find A\nDoctor', icon: '👨‍⚕️', route: '/dashboard/find-doctor' },
    { title: 'Call For\nAppointment', icon: '📞', route: '/dashboard/call-appointment' },
    { title: 'Upload\nDocuments', icon: '📂', route: '/dashboard/upload-documents', private: true },
    { title: 'Documents', icon: '📄', route: '/dashboard/documents', private: true },
    { title: 'View Lab\nReports', icon: '📊', route: '/dashboard/lab-reports', private: true },
    { title: 'Contact Us', icon: '✉️', route: '/dashboard/contact-us' },
    { title: 'About Us', icon: 'ℹ️', route: '/dashboard/about-us' },
  ];

  const visibleMenuItems = isGuest ? menuItems.filter(item => !item.private) : menuItems;

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dash-header">
        
        {/* Left Side: Menu Button & Logo */}
        <div className="header-brand" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="menu-btn">≡</button>
          <div className="logo-wrapper">
            <div className="logo-mark"></div>
            <div className="logo-text-container">
              <span className="logo-title">HOSPITAL</span>
              <span className="logo-subtitle">A U T O M A N A G E R</span>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Button */}
        <button className="logout-btn" onClick={handleAuthAction}>
          {isGuest ? 'Login' : 'Logout'}
        </button>

      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <Carousel/>
      </section>

      {/* Main Grid */}
      <section className="menu-grid">
        {visibleMenuItems.map((item, index) => (
          <div 
            key={index} 
            className="menu-card"
            onClick={() => navigate(item.route)}
          >
            <div className="menu-icon">{item.icon}</div>
            <h3 className="menu-title" style={{ whiteSpace: 'pre-line' }}>
              {item.title}
            </h3>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Dashboard;