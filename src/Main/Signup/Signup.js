import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Login/Auth.css';

const Signup = () => {
  const navigate = useNavigate();

  // 1. Create state to hold all the form inputs
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });

  // 2. Handle input changes and update state
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 3. Handle the actual signup request
  const handleSignup = async () => {
    // Basic validation: Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      // Send the POST request to your Node.js backend
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          mobile: formData.mobile,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success! Alert the user and send them to the login page
        alert("Registration successful! Please sign in.");
        navigate('/login');
      } else {
        // The backend returned an error (e.g., Email already exists)
        alert(data.error || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("Cannot connect to the server. Is your backend running?");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-form-container">
        
        {/* Added name, value, and onChange to all inputs */}
        <input 
          type="text" 
          name="firstName"
          placeholder="First Name" 
          className="auth-input" 
          value={formData.firstName}
          onChange={handleChange}
        />
        <input 
          type="text" 
          name="lastName"
          placeholder="Last Name" 
          className="auth-input" 
          value={formData.lastName}
          onChange={handleChange}
        />
        <input 
          type="email" 
          name="email"
          placeholder="Email" 
          className="auth-input" 
          value={formData.email}
          onChange={handleChange}
        />
        <input 
          type="tel" 
          name="mobile"
          placeholder="Mobile" 
          className="auth-input" 
          value={formData.mobile}
          onChange={handleChange}
        />
        <input 
          type="password" 
          name="password"
          placeholder="Password" 
          className="auth-input" 
          value={formData.password}
          onChange={handleChange}
        />
        <input 
          type="password" 
          name="confirmPassword"
          placeholder="Confirm Password" 
          className="auth-input" 
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        
        <button 
          className="auth-button"
          onClick={handleSignup} // Changed from navigate to our new function
        >
          Sign Up
        </button>
        
        <p className="auth-footer-text">
          If you already registered{' '}
          <span 
            className="auth-link" 
            onClick={() => navigate('/login')}
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;