import React from 'react';
import { useNavigate } from 'react-router-dom';
import Carousel from '../../Help/AutoScroll';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  // --- LOGOUT LOGIC ---
  const handleLogout = () => {
    // Clear the session tokens
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirect to login page
    navigate('/login');
  };

  const menuItems = [
    { title: 'Profile', icon: '👤', route: '/dashboard/profile' }, // <-- ADDED PROFILE ROUTE
    { title: 'Diagnosis', icon: '🖥️', route: '/dashboard/diagnosis' }, 
    { title: 'Book An\nAppointment', icon: '📅', route: 'dashboard' },
    { title: 'Appointment\nList', icon: '📋', route: 'dashboard' },
    { title: 'Find A\nDoctor', icon: '👨‍⚕️', route: 'dashboard' },
    { title: 'Call For\nAppointment', icon: '📞', route: 'dashboard' },
    { title: 'Upload\nDocuments', icon: '📂', route: 'dashboard' },
    { title: 'Documents', icon: '📄', route: 'dashboard' },
    { title: 'View Lab\nReports', icon: '📊', route: 'dashboard' },
    { title: 'Contact Us', icon: '✉️', route: 'dashboard' },
    { title: 'About Us', icon: 'ℹ️', route: 'dashboard' },
  ];

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

        {/* Right Side: Logout Button */}
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>

      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <Carousel/>
      </section>

      {/* Main Grid */}
      <section className="menu-grid">
        {menuItems.map((item, index) => (
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