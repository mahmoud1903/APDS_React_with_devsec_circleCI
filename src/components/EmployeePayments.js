// EmployeePayments.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './history.css';

const EmployeePayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found in localStorage.");
      navigate('/login');
      return;
    }

    const fetchPayments = async () => {
      setLoading(true);
      console.log("Fetching all payments...");

      try {
        const response = await axios.get('https://localhost:5001/api/payment', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPayments(response.data);
        setError('');
        console.log("Payments fetched successfully:", response.data);
      } catch (error) {
        console.error('Error fetching payments:', error);
        setError('Failed to fetch payments.');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [navigate]);

  const formatCurrency = (amount) => `R${parseFloat(amount).toFixed(2)}`;

  return (
    <div className="align">
      <h2>All Payments</h2>
      {error && <p className="error text--center">{error}</p>}
      {loading ? (
        <p className="text--center">Loading...</p>
      ) : (
        <div className="grid">
          {payments.map((payment) => (
            <div key={payment._id} className="payment-entry">
              <div className="form__field">
                <span className="icon">Amount:</span>
                <span className="form__input">{formatCurrency(payment.amount)}</span>
              </div>
              <div className="form__field">
                <span className="icon">Sender Account:</span>
                <span className="form__input">{payment.senderAccount}</span>
              </div>
              <div className="form__field">
                <span className="icon">Receiver Account:</span>
                <span className="form__input">{payment.receiverAccount}</span>
              </div>
              <div className="form__field">
                <span className="icon">Date:</span>
                <span className="form__input">{new Date(payment.date).toLocaleString()}</span>
              </div>
            </div>
          ))}
          <div className="buttonContainer">
            <button className="button" onClick={() => navigate('/employee-dashboard')}>Back to Dashboard</button>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeePayments;
