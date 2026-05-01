import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Carousel from '../../Help/AutoScroll';
import './Dashboard.css';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const menuItems = [
    // { title: 'Profile', icon: '👤', route: '/dashboard/profile', private: true },
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
    <div className={`dashboard-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Side Navigation */}
      <div className={`side-nav ${isSidebarOpen ? 'active' : ''}`}>
        <div className="side-nav-header">
          <div className="side-profile">
            <div className="profile-icon">👤</div>
            <div className="profile-info">
              <span className="profile-name">{isGuest ? 'Guest User' : 'Authorized User'}</span>
              <span className="profile-status">Online</span>
            </div>
          </div>
          <button className="close-btn" onClick={toggleSidebar}>&times;</button>
        </div>
        
        <div className="side-nav-content">
          <div className="side-nav-item" onClick={() => { navigate('/dashboard/profile'); toggleSidebar(); }}>
            <span className="item-icon">👤</span>
            <span className="item-text">My Profile</span>
          </div>
          <div className="side-nav-item logout-item" onClick={handleAuthAction}>
            <span className="item-icon">{isGuest ? '🔑' : '🚪'}</span>
            <span className="item-text">{isGuest ? 'Login' : 'Logout'}</span>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

      {/* Header */}
      <header className="dash-header">
        
        {/* Left Side: Menu Button & Logo */}
        <div className="header-brand" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="menu-btn" onClick={toggleSidebar}>≡</button>
          <div className="logo-wrapper">
            <div className="logo-text-container">
              <span className="logo-title">HOSPITAL</span>
              <span className="logo-subtitle">A U T O M A N A G E R</span>
            </div>
          </div>
        </div>

        {/* Profile moved to left sidebar, removing from right header if redundant, 
            or keeping a minimal version if needed. User asked to move it to left. */}
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