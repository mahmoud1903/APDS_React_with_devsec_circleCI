// src/components/Login.js

import React, { useState } from 'react';
import { login } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './login.css';

const employees = [
  { username: 'Employee1', password: 'Password1!', role: 'employee' },
  { username: 'Employee2', password: 'Password2!', role: 'employee' },
];

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

// Define regex patterns for validation
const usernamePattern = /^[a-zA-Z0-9\W]{3,20}$/; // Allows alphanumeric and all special characters, 3-20 chars
const passwordPattern = /^[a-zA-Z0-9!@#$%^&*]{6,20}$/; // Alphanumeric and special chars, 6-20 chars

// Function to validate input fields
const validateInput = () => {
  // Check if the username matches an employee account
  const isEmployee = employees.some(
    (employee) => employee.username === username && employee.password === password
  );

  if (isEmployee) {
    return true; // Skip further validation for employee accounts
  }

  if (!usernamePattern.test(username)) {
    setErrorMessage('Invalid username. Only alphanumeric characters and underscores (3-20 chars) are allowed.');
    return false;
  }
  if (!passwordPattern.test(password)) {
    setErrorMessage('Invalid password. Only alphanumeric characters and certain symbols (6-20 chars) are allowed.');
    return false;
  }

  return true;
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');


    // Validate input before sending data
    if (!validateInput()) {
      setLoading(false);
      return;
    }

    try {
      const loginData = { username, password };
      console.log('Sending login data:', loginData); // Log data before sending

      const response = await login(loginData);
      
      if (response && response.token && response.role) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userCode', response.userCode);
        localStorage.setItem('role', response.role);

        // Redirect based on user role
        if (response.role === 'employee') {
          navigate('/employee-dashboard');
        } else {
          navigate('/landingpage');
        }
      } else {
        console.error('Unexpected server response:', response); // Log unexpected response
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login failed:', error); // Log error details
      setErrorMessage('Login failed: Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="align">
      <div className="grid">
        <form onSubmit={handleSubmit} className="form login">
          <h2 className="text--center">Login</h2>
          <div className="form__field">
            <label>Username</label>
            <input
              autoComplete="username"
              id="login__username"
              type="text"
              className="form__input"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form__field">
            <label>Password</label>
            <input
              id="login__password"
              type={showPassword ? "text" : "password"}
              className="form__input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label className="password-checkbox">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              /> Show Password
            </label>
          </div>

          <div className="form__field">
            <input type="submit" value={loading ? 'Logging in...' : 'Login'} />
          </div>

          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
