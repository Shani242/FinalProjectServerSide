const mongoose = require('mongoose');

/**
 * @module models/costs
 *
 * Cost Schema - Represents an expense record in the system.
 * @typedef {Object} Cost
 * @property {number} userid - ID of the user who owns this cost record.
 * @property {string} description - Description of the expense.
 * @property {string} category - Category of the expense (food, health, housing, sport, education).
 * @property {number} sum - Amount spent.
 * @property {Date} date - Date of the expense.
 */

/**
 * Cost schema defining the structure of the costs collection in MongoDB.
 * Each document represents an expense entry for a user.
 */
const costSchema = new mongoose.Schema({
    userid: {
        type: Number,
        required: true,
        index: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['food', 'health', 'housing', 'sport', 'education']
    },
    sum: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

/**
 * Finds all cost records associated with a specific user ID.
 * @function findByUserId
 * @param {number} userid - The ID of the user whose costs to fetch.
 * @returns {Promise<Cost[]>} A list of cost records. If no records exist, an empty array is returned.
 * @throws {Error} If an issue occurs while querying the database.
 */
costSchema.statics.findByUserId = function(userid) {
    return this.find({ userid });
};

/**
 * Cost model representing costs collection in MongoDB.
 * @type {mongoose.Model<Cost>}
 */
const Cost = mongoose.model('Cost', costSchema);

module.exports = Cost;
