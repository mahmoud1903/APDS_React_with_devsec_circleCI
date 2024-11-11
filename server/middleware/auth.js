const jwt = require('jsonwebtoken');

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


// Middleware to check if the user is an employee or admin
const isEmployeeOrAdmin = (req, res, next) => {
  console.log("Checking if user is employee:", req.user); // Log req.user data
  if (req.user?.role === 'employee' || req.user?.role === 'admin') {
    console.log("Employee access granted to:", req.user.userId);
    next();
  } else {
    console.log("Access denied. Employee role required for user:", req.user ? req.user.userId : "Unknown");
    res.status(403).json({ message: 'Access denied. Employee or admin role required.' });
  }
};

module.exports = { isAuthenticated, isEmployeeOrAdmin };
