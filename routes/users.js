const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Cost = require("../models/cost");

/**
 * @module routes/users
 *
 * @description Handles user-related operations, including retrieving user details and their total expenses.
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
 * @typedef {Object} UserExpenseSummary
 * @property {number} id - User ID.
 * @property {string} first_name - First name of the user.
 * @property {string} last_name - Last name of the user.
 * @property {number} total - Total expenses of the user.
 */

/**
 * @route GET /api/users/:id
 * @description Retrieves user details and their total expenses using MongoDB aggregation.
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Request parameters.
 * @param {number} req.params.id - The user ID to fetch.
 * @param {Object} res - Express response object.
 * @returns {UserExpenseSummary} JSON object containing user details including first name, last name, ID, and total expenses.
 * @throws {404} If the user is not found.
 * @throws {500} If an internal server error occurs.
 */
router.get("/:id", async (req, res) => {
    try {
        const userId = parseInt(req.params.id);

        // Fetch user details
        const user = await User.findOne({ id: userId });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Compute total expenses using MongoDB aggregation
        const totalCostResult = await Cost.aggregate([
            { $match: { userid: userId } },
            { $group: { _id: "$userid", totalCost: { $sum: "$sum" } } }
        ]);

        const totalCost = totalCostResult.length > 0 ? totalCostResult[0].totalCost : 0;

        res.status(200).json({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            total: totalCost,
        });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
});

module.exports = router;
