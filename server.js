/**
 * Cost Manager API Server
 * Main server configuration file
 * @module server
 * @requires express
 * @requires mongoose
 * @requires dotenv
 * @requires cors
 */

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

/**
 * API Routes Configuration
 * - /api/add: Add new cost
 * - /api/report: Get monthly cost report
 * - /api/users: User operations
 * - /api/about: Development team info
 */
app.use('/api', require('./routes/costs'));        // For /api/add and /api/report endpoints
app.use('/api/users', require('./routes/users'));  // For user operations
app.use('/api/about', require('./routes/about'));  // For development team info

/**
 * MongoDB Connection Setup
 * Connects to MongoDB Atlas
 */
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Connected successfully to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    });

/**
 * MongoDB Event Listeners
 * Monitor database connection status
 */
mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
    console.log('MongoDB reconnected');
});

// Server Initialization
const port = process.env.PORT || (process.env.NODE_ENV === 'test' ? 4000 : 3000);
app.listen(port, () => console.log(`Server running on port ${port}`));

// Export app for testing purposes
module.exports = app;
