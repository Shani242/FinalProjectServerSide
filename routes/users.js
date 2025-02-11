const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Cost = require('../models/cost');

/**
 * @module routes/users
 *
 * This module defines the user-related API routes for retrieving user details and total expenses.
 */

/**
 * GET /api/users/:id
 * @description Retrieves user details and their total expenses.
 * @route {GET} /api/users/:id
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Request parameters.
 * @param {number} req.params.id - The user ID to fetch.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON object containing user details including first name, last name, ID, and total expenses.
 * @throws {404} If the user is not found.
 * @throws {500} If an internal server error occurs.
 */
router.get('/:id', async (req, res) => {
    try {
        const userId = parseInt(req.params.id);

        // Fetch user by `id`
        const user = await User.findOne({ id: userId });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Fetch all costs related to the user
        const costs = await Cost.find({ userid: userId });

        console.log("User Found:", user); // Debugging log to verify user object

        res.status(200).json({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            total: costs.reduce((sum, cost) => sum + cost.sum, 0)
        });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
});

module.exports = router;