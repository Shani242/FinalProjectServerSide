const express = require("express");
const router = express.Router();
const Cost = require("../models/cost");

/**
 * POST /api/add
 * Adds a new cost item
 */
router.post("/add", async (req, res) => {
    try {
        const { description, category, userid, sum, date } = req.body;

        const validCategories = ["food", "health", "housing", "sport", "education"];
        if (!validCategories.includes(category)) {
            return res.status(400).json({ error: "Invalid category. Must be one of: food, health, housing, sport, education" });
        }

        const newCost = new Cost({
            description,
            category,
            userid,
            sum,
            date: date ? new Date(date) : new Date(),
        });

        const savedCost = await newCost.save();

        res.status(201).json(savedCost);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * GET /api/report
 * Retrieves a monthly cost report
 */
router.get("/report", async (req, res) => {
    try {
        const { id, year, month } = req.query;
        const numericYear = parseInt(year);
        const numericMonth = parseInt(month);
        const numericId = parseInt(id);

        const startDate = new Date(numericYear, numericMonth - 1, 1);
        const endDate = new Date(numericYear, numericMonth, 0);

        const costs = await Cost.find({
            userid: numericId,
            date: { $gte: startDate, $lte: endDate },
        });

        const categories = ["food", "health", "housing", "sport", "education"];
        const groupedCosts = categories.map((category) => ({
            [category]: costs
                .filter((cost) => cost.category === category)
                .map((cost) => ({
                    sum: cost.sum,
                    description: cost.description,
                    day: cost.date.getDate(),
                })),
        }));

        res.status(200).json({
            userid: numericId,
            year: numericYear,
            month: numericMonth,
            costs: groupedCosts,
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
