import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './deleteUser.css'; // Import the new stylesheet

const DeleteUser = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://localhost:5001/api/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to fetch users. Please try again.');
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://localhost:5001/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user. Please try again.');
    }
  };

  return (
    <div className="align">
      <h2>Delete Users</h2>
      {error && <p className="error">{error}</p>}
      
      <div className="grid">
        {users.map(user => (
          <div key={user._id} className="user-entry">
            <span>Username: {user.username}</span>
            <button className="delete-button" onClick={() => handleDeleteUser(user._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
      
      <div className="grid">
        <button className="button" onClick={() => navigate('/employee-dashboard')}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default DeleteUser;
