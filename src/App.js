// App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Landingpage from './components/Landingpage';
import PaymentPortal from './components/PaymentPortal';
import PaymentHistory from './components/PaymentHistory';
import OpeningPage from './components/OpeningPage';  // Import OpeningPage
import EmployeeDashboard from './components/EmployeeDashboard';
import CreateUser from './components/CreateUser';  // Import CreateUser component
import ProtectedRoute from './components/ProtectedRoute';
import EmployeePayments from './components/EmployeePayments';
import DeleteUser from './components/DeleteUser';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<OpeningPage />} />  {/* Set OpeningPage as the default */}
        <Route path="/login" element={<Login />} />
        <Route path="/Landingpage" element={<Landingpage />} />
        <Route path="/payment" element={<PaymentPortal />} />
        <Route path="/history" element={<PaymentHistory userCode={localStorage.getItem('userCode')} />} />

        {/* Protected Routes */}
        <Route 
          path="/employee-dashboard" 
          element={
            <ProtectedRoute requiredRole="employee">
              <EmployeeDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/create-user" 
          element={
            <ProtectedRoute requiredRole="employee">
              <CreateUser />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/employee-payments" 
          element={
            <ProtectedRoute requiredRole="employee">
              <EmployeePayments />
            </ProtectedRoute>
          } 
        />

      <Route 
          path="/delete-user" 
          element={
            <ProtectedRoute requiredRole="employee">
              <DeleteUser />
            </ProtectedRoute>
          } 
        />
        
      </Routes>
    </Router>
  );
}

export default App;
