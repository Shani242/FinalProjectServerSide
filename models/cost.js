const mongoose = require("mongoose");
/**
 * @module models/cost
 *
 * @description Cost Schema - Represents an expense record in the system.
 */

/**
 * @typedef {Object} Cost
 * @property {number} userid - ID of the user who owns this cost record.
 * @property {string} description - Description of the expense.
 * @property {string} category - Category of the expense (Allowed: food, health, housing, sport, education).
 * @property {number} sum - Amount spent.
 * @property {Date} date - Date of the expense (defaults to the current date).
 */

/**
 * Cost schema defining the structure of the costs collection in MongoDB.
 * Each document represents an expense entry for a user.
 */
const costSchema = new mongoose.Schema({
    userid: { type: Number, required: true, index: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, enum: ["food", "health", "housing", "sport", "education"] },
    sum: { type: Number, required: true },
    date: { type: Date, default: Date.now },
});

/**
 * Cost model representing the 'costs' collection in MongoDB.
 * @type {mongoose.Model<Cost>}
 */
const Cost = mongoose.model("Cost", costSchema);
module.exports = Cost;
