import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const isAuthenticated = localStorage.getItem('token'); // Check if token is present
  const userRole = localStorage.getItem('role'); // Get the role from localStorage

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/landingpage" />;
  }

  return children; // Render the protected component if authenticated and role matches
};

export default ProtectedRoute;
