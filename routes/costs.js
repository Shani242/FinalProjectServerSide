const express = require('express');
const router = express.Router();
const Cost = require('../models/costs');

/**
 * @module routes/costs
 *
 * This module handles cost-related operations such as adding new costs and generating reports.
 */

/**
 * POST /api/add
 * @description Adds a new cost entry to the database
 * @route {POST} /api/add
 * @param {Object} req.body - Request body
 * @param {string} req.body.description - Description of the expense
 * @param {string} req.body.category - Category of the expense (food, health, housing, sport, education)
 * @param {number} req.body.userid - ID of the user who owns this cost record
 * @param {number} req.body.sum - Amount spent
 * @param {Date} [req.body.date] - Date of the expense (defaults to current date if not provided)
 * @returns {Object} JSON object containing the saved cost details
 * @throws {400} If the category is invalid or an error occurs while saving
 */
router.post('/add', async (req, res) => {
    try {
        const { description, category, userid, sum, date } = req.body;

        const validCategories = ['food', 'health', 'housing', 'sport', 'education'];
        if (!validCategories.includes(category)) {
            return res.status(400).json({
                error: 'Invalid category. Must be one of: food, health, housing, sport, education'
            });
        }

        const newCost = new Cost({
            description,
            category,
            userid,
            sum,
            date: date ? new Date(date) : new Date()
        });

        const savedCost = await newCost.save();

        res.status(201).json({
            description: savedCost.description,
            category: savedCost.category,
            userid: savedCost.userid,
            sum: savedCost.sum,
            date: savedCost.date
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * GET /api/report
 * @description Retrieves a monthly cost report for a user, categorized by expense type
 * @route {GET} /api/report
 * @param {Object} req.query - Query parameters
 * @param {number} req.query.id - User ID
 * @param {number} req.query.year - Year of the report
 * @param {number} req.query.month - Month of the report
 * @returns {Object} JSON object containing categorized cost details for the specified month
 * @throws {400} If an error occurs while retrieving costs
 */
router.get('/report', async (req, res) => {
    try {
        const { id, year, month } = req.query;
        const numericYear = parseInt(year);
        const numericMonth = parseInt(month);
        const numericId = parseInt(id);

        const startDate = new Date(numericYear, numericMonth - 1, 1);
        const endDate = new Date(numericYear, numericMonth, 0);

        const costs = await Cost.find({
            userid: numericId,
            date: {
                $gte: startDate,
                $lte: endDate
            }
        });

        const requiredCategories = ['food', 'health', 'housing', 'sport', 'education'];
        const categorizedCosts = requiredCategories.map(category => ({
            [category]: costs
                .filter(cost => cost.category === category)
                .map(cost => ({
                    sum: cost.sum,
                    description: cost.description,
                    day: cost.date.getDate()
                }))
        }));

        res.status(200).json({
            userid: numericId,
            year: numericYear,
            month: numericMonth,
            costs: categorizedCosts
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
