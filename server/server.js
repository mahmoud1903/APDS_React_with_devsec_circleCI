require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const fs = require('fs');
const https = require('https');
const rateLimit = require('express-rate-limit');

// Initialize app
const app = express();

// Apply security headers and CORS policy
app.use(helmet());
app.use(cors({ origin: 'https://localhost:3000', credentials: true })); // Allow requests from frontend origin

// Request rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Body parser middleware
app.use(express.json());

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/apds2', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected: localhost');
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
};
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth')); // Authentication routes
app.use('/api/payment', require('./routes/payment')); // Payment-related routes
app.use('/api/users', require('./routes/users'));

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Secure Server');
});

// SSL Certificate and Key
const options = {
    key: fs.readFileSync('./Keys/privatekey.pem'),
    cert: fs.readFileSync('./Keys/certificate.pem')
};

// Start HTTPS server
const PORT = process.env.PORT || 5001;
https.createServer(options, app).listen(PORT, () => {
    console.log(`HTTPS Server running on https://localhost:${PORT}`);
});
