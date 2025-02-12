const mongoose = require("mongoose");
/**
 * @module models/user
 *
 * @description User Schema - Represents a user in the system.
 */

/**
 * @typedef {Object} User
 * @property {number} id - Unique identifier for the user.
 * @property {string} first_name - User's first name.
 * @property {string} last_name - User's last name.
 * @property {Date} birthday - User's date of birth.
 * @property {string} marital_status - User's marital status.
 */

/**
 * User schema defining the structure of the users collection in MongoDB.
 * Each document represents an individual user in the system.
 */
const userSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true, index: true },
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    birthday: { type: Date, required: true },
    marital_status: { type: String, required: true, trim: true },
});

/**
 * User model representing the 'users' collection in MongoDB.
 * @type {mongoose.Model<User>}
 */
const User = mongoose.model("User", userSchema);
module.exports = User;
