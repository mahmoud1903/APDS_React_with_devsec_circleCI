const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
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


// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log("Login attempt with:", { username, password });

    try {
        const user = await User.findOne({ username });
        if (!user) {
            console.log("User not found:", username);
            return res.status(400).json({ msg: 'Invalid credentials' });
        } else {
            console.log("User found:", user);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Comparing passwords:", { enteredPassword: password, storedHash: user.password, isMatch });

        if (!isMatch) {
            console.log("Password mismatch for user:", username);
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

         // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Set the token expiration time as desired
    );

        console.log("Generated JWT token:", token); // Log the generated token
        console.log("Login successful for user:", username);
        res.json({ token, role: user.role, userCode: user.userCode });
    } catch (err) {
        console.error("Server error during login:", err.message);
        return res.status(500).json({ msg: 'Server error' });
    }
});

// Route to create a new user, accessible only by employees
router.post('/create',  isAuthenticated, isEmployee, async (req, res) => {
    const { username, password, role } = req.body;
    const token = req.header('Authorization');
    console.log("User creation attempt by:", req.user);

    console.log("Create user attempt:", { username, role }); // Log incoming data
    console.log("Received token for user creation:", token);

    try {
        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            console.log("Username already exists:", username);
            return res.status(400).json({ msg: 'Username already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Password hashed successfully:", hashedPassword);

        // Create a new user
        const newUser = new User({
            username,
            password: hashedPassword,
            role
        });

        // Save the user to the database
        const savedUser = await newUser.save();
        console.log("New user created successfully:", savedUser);

        res.status(201).json({ msg: 'User created successfully', newUser: savedUser });
    } catch (error) {
        console.error("Error creating user:", error.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
