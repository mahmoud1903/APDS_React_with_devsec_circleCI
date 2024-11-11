// EmployeeDashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const EmployeeDashboard = () => {
  const navigate = useNavigate();

  const goToCreateUser = () => {
    navigate('/create-user');
  };

  const goToPaymentsPage = () => {
    navigate('/employee-payments');
  };

  const goToDeleteUserPage = () => {
    navigate('/delete-user');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login'); // Navigate to login page after logout
  };

  return (
    <div className="align">
      <div className="grid">
        <h1>Employee Dashboard</h1>
        <div className="form">
          <div className="form__field">
            <button className="button" onClick={goToCreateUser}>
              Create New User
            </button>
          </div>
          <div className="form__field">
            <button className="button" onClick={goToPaymentsPage}>
              View All Payments
            </button>
          </div>
          <div className="form__field">
            <button className="button" onClick={goToDeleteUserPage}>
              Delete User
            </button>
          </div>
          <div className="form__field">
            <button className="button logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
