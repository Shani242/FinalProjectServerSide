/**
 * Cost Manager API Server
 * @module server
 */

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

/**
 * API Routes - EXACTLY as required
 */
app.use("/api", require("./routes/costs"));   // Handles /api/add and /api/report
app.use("/api/users", require("./routes/users"));  // Handles /api/users/:id
app.use("/api/about", require("./routes/about"));  // Handles /api/about

/**
 * Connect to MongoDB Atlas
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

// If not in test mode, connect to DB and start the server
if (process.env.NODE_ENV !== "test") {
    connectDB();
    const port = process.env.PORT || 3000;
    const server = app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
    module.exports = { app, server };
} else {
    module.exports = { app, connectDB };
}
