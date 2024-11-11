// routes/users.js
const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
//const { isAuthenticated, isEmployeeOrAdmin } = require('../middleware/auth');
const router = express.Router();

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


// Get all users (for display on Delete User page)
router.get('/', isAuthenticated, isEmployee, async (req, res) => {
  try {
    const users = await User.find({}, 'username'); // Fetch only usernames
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ message: 'Server error. Could not fetch users.' });
  }
});

// Delete a user by ID
router.delete('/:id', isAuthenticated, isEmployee, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ message: 'Server error. Could not delete user.' });
  }
});

module.exports = router;
