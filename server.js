/**
 * @module server
 *
 * @description Cost Manager API Server - The main entry point for the application.
 * It initializes Express, connects to MongoDB, and sets up API routes.
 */

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

/**
 * Middleware Configuration
 * - Enables CORS to allow cross-origin requests
 * - Parses incoming JSON requests
 */
app.use(cors());
app.use(express.json());

/**
 * API Routes
 * - `/api` handles cost-related operations (adding costs, generating reports)
 * - `/api/users` handles user-related operations (retrieving user details)
 * - `/api/about` returns information about the development team
 */
app.use("/api", require("./routes/costs"));   // Handles /api/add and /api/report
app.use("/api/users", require("./routes/users"));  // Handles /api/users/:id
app.use("/api/about", require("./routes/about"));  // Handles /api/about

/**
 * Establishes a connection to MongoDB Atlas
 * @async
 * @function connectDB
 * @throws {Error} If the connection fails
 */
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ Connected successfully to MongoDB");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        process.exit(1);
    }
};

/**
 * Starts the server only if not in test mode
 */if (process.env.NODE_ENV !== "test") {
    connectDB();
    const port = process.env.PORT || 3000;
    const server = app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
    /**
     * @exports app - The Express app instance
     * @exports server - The running server instance
     */
    module.exports = { app, server };
} else {
    /**
     * @exports app - The Express app instance (for testing)
     * @exports connectDB - The function to connect to MongoDB (for testing)
     */
    module.exports = { app, connectDB };
}
