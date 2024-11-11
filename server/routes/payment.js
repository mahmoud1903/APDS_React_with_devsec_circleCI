const express = require('express');
const jwt = require('jsonwebtoken');
const Payment = require('../models/Payment');
const router = express.Router();

/*
const { isAuthenticated, isEmployee } = require('../middleware/auth');
*/



// Middleware to check if user is an employee
const isEmployee = (req, res, next) => {
  if (req.user && req.user.role === 'employee') {
      console.log("Employee access granted for:", req.user.username);
      next();
  } else {
      console.log("Access denied. Employee role required.");
      return res.status(403).json({ msg: 'Access denied. Employee role required.' });
  }
};

//new
const isAuthenticated = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      console.log("Decoded token:", decoded); // Log the decoded token
      console.log("Token verified. User data:", req.user);
      next();
  } catch (err) {
      console.log("Token verification failed:", err.message);
      res.status(401).json({ message: 'Token is not valid' });
  }
};


// Middleware to check if user is an employee
router.post('/', isAuthenticated, async (req, res) => {
    const { userCode, senderAccount, receiverAccount, amount } = req.body;
    console.log("Received payment request:", { userCode, senderAccount, receiverAccount, amount });

    try {
        const payment = new Payment({
            userCode,
            senderAccount,
            receiverAccount,
            amount,
            date: new Date()
        });

        const savedPayment = await payment.save();
        console.log("Payment processed and saved:", savedPayment);

        res.status(201).json({ msg: 'Payment processed successfully', payment: savedPayment });
    } catch (err) {
        console.error("Error saving payment:", err.message);
        res.status(500).json({ message: 'Server error. Could not process payment.' });
    }
});

// Get payment history for specific user
router.get('/history/:userCode', isAuthenticated, async (req, res) => {
    try {
        const payments = await Payment.find({ userCode: req.params.userCode });
        console.log("Fetched payments for user:", req.params.userCode, payments);
        res.status(200).json(payments);
    } catch (err) {
        console.error("Error fetching payment history:", err.message);
        res.status(500).json({ message: 'Server error. Could not retrieve payment history.' });
    }
});

// Get all payments (only accessible to employees)
router.get('/', isAuthenticated, isEmployee, async (req, res) => {
  try {
      //const payments = await Payment.find().populate('user', 'username');
      const payments = await Payment.find();
      console.log("Fetched all payments:", payments);
      res.status(200).json(payments);
  } catch (error) {
      console.error("Error fetching all payments:", error.message);
      res.status(500).json({ message: 'Server error. Could not retrieve all payments.' });
  }
});




module.exports = router;
