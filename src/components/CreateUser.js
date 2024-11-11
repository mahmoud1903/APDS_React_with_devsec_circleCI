import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const API_BASE_URL = 'https://localhost:5001/api/auth';

const CreateUser = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const goToDashboard = () => navigate('/employee-dashboard');

   // Validation patterns
   const usernamePattern = /^[a-zA-Z0-9\W]{3,20}$/; // Allows alphanumeric and all special characters, 3-20 chars
   const passwordPattern = /^[a-zA-Z0-9!@#$%^&*]{6,20}$/; // Allow alphanumeric and some special characters, 6-20 characters

  const validateInput = () =>{
if(!usernamePattern.test(username)){
  setError('invalid username,Only alphanumeric characters and underscores (3-20 chars) are allowed. ')
}
if (!passwordPattern.test(password)) {
  setError('Invalid password. Only alphanumeric characters and certain symbols (6-20 chars) are allowed.');
  return false;
}
if (role !== 'user' && role !== 'employee') {
  setError('Invalid role. Only "user" or "employee" roles are allowed.');
  return false;
}
return true;
  }


  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

if(!validateInput()){
  return;
}

    const token = localStorage.getItem('token');
    console.log("Using token for user creation:", token);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/create`,
        { username, password, role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setSuccess(`User created successfully: ${response.data.newUser.username}`);
      setUsername('');
      setPassword('');
      setRole('user');
    } catch (error) {
      console.error('Error creating user:', error);
      setError('Failed to create user. Please try again.');
    }
  };

  return (
    <div className="payment-portal">
      <h2>Create User Portal</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleCreateUser} className="payment-form">
        <label htmlFor="username">Username
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label htmlFor="password">Password
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <label htmlFor="role">Role
          <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">User</option>
            <option value="employee">Employee</option>
           
          </select>
        </label>
        <button className="button" type="submit">Create User</button>
        <div className="buttonContainer">
          <button className="button" onClick={goToDashboard}>Back to Dashboard</button>
        </div>
      </form>
    </div>
  );
};

export default CreateUser;
