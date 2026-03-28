import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css'; 

const Login = () => {
  const navigate = useNavigate();

  // 1. Create state to hold email and password
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  // 2. Update state when the user types
  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  // 3. Handle the login request
  const handleLogin = async () => {
    // Basic validation to make sure fields aren't empty
    if (!credentials.email || !credentials.password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // SUCCESS: Save the JWT token to local storage to unlock Protected Routes
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.user.id);
        // Navigate to the dashboard
        navigate('/dashboard');
      } else {
        // FAILURE: Alert the user with the error message from the backend
        alert(data.error || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      // FAILURE: Alert if the server is completely down
      console.error("Login error:", error);
      alert("Cannot connect to the server. Is your backend running?");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-form-container">
        <input 
          type="email" 
          name="email"
          placeholder="Email" 
          className="auth-input" 
          value={credentials.email}
          onChange={handleChange}
        />
        <input 
          type="password" 
          name="password"
          placeholder="Password" 
          className="auth-input" 
          value={credentials.password}
          onChange={handleChange}
        />
        
        <button 
          className="auth-button"
          onClick={handleLogin} // Triggers the API call and alerts
        >
          Login
        </button>
        
        <p className="auth-footer-text">
          Don't have an account?{' '}
          <span 
            className="auth-link" 
            onClick={() => navigate('/signup')}
          >
            Register now
          </span>
        </p>
      </div>
      
    </div>
  );
};

export default Login;