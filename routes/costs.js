const express = require("express");
const router = express.Router();
const Cost = require("../models/cost");
const User = require("../models/user");

/**
 * In-memory cache for storing computed reports.
 * Format: { "userId-year-month": { reportData, timestamp } }
 */
const reportCache = new Map();

/**
 * @route POST /api/add
 * @description Adds a new cost item to the database and invalidates the cache for the corresponding month.
 */
router.post("/add", async (req, res) => {
    try {
        console.log("Received request body:", req.body);

        const { description, category, userid, sum, date } = req.body;

        if (!description || !category || !userid || !sum) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const validCategories = ["food", "health", "housing", "sport", "education"];
        if (!validCategories.includes(category)) {
            return res.status(400).json({ error: "Invalid category" });
        }

        const expenseDate = date ? new Date(date) : new Date();
        const newCost = new Cost({
            description,
            category,
            userid,
            sum,
            date: expenseDate,
        });

        await newCost.save();

        // Invalidate cache for the specific month and year
        const cacheKey = `${userid}-${expenseDate.getFullYear()}-${expenseDate.getMonth() + 1}`;
        reportCache.delete(cacheKey);
        console.log(`Cache invalidated for: ${cacheKey}`);

        // Update total user expenses
        const totalExpenses = await Cost.aggregate([
            { $match: { userid } },
            { $group: { _id: null, total: { $sum: "$sum" } } }
        ]);

        await User.updateOne({ id: userid }, { total: totalExpenses[0]?.total || 0 });

        res.status(201).json(newCost);
    } catch (err) {
        console.error("Error saving cost:", err);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
});

/**
 * @route GET /api/report
 * @description Retrieves a categorized monthly cost report for a specific user using **smart caching**.
 */
router.get("/report", async (req, res) => {
    try {
        const { id, year, month } = req.query;
        const numericYear = parseInt(year);
        const numericMonth = parseInt(month);
        const numericId = parseInt(id);

        if (!numericId || !numericYear || !numericMonth) {
            return res.status(400).json({ error: "Invalid request parameters" });
        }

        const startDate = new Date(numericYear, numericMonth - 1, 1);
        const endDate = new Date(numericYear, numericMonth, 0);

        // Required categories
        const requiredCategories = ["food", "health", "housing", "sport", "education"];

        // Cache key
        const cacheKey = `${numericId}-${numericYear}-${numericMonth}`;

        // Check if report is already cached
        if (reportCache.has(cacheKey)) {
            console.log(`Returning cached report for: ${cacheKey}`);
            return res.status(200).json(reportCache.get(cacheKey));
        }

        // MongoDB Aggregation - Fetch data in real-time
        const costsByCategory = await Cost.aggregate([
            {
                $match: {
                    userid: numericId,
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: "$category",
                    details: {
                        $push: {
                            sum: "$sum",
                            description: "$description",
                            day: { $dayOfMonth: "$date" }
                        }
                    }
                }
            }
        ]);

        // Initialize report with empty categories as an array of objects
        const formattedReport = requiredCategories.map(category => ({
            [category]: []
        }));

        // Populate report with actual data
        costsByCategory.forEach(categoryData => {
            const index = formattedReport.findIndex(item => item.hasOwnProperty(categoryData._id));
            if (index !== -1) {
                formattedReport[index][categoryData._id] = categoryData.details;
            }
        });

        // Store computed result in cache
        const computedReport = {
            userid: numericId,
            year: numericYear,
            month: numericMonth,
            costs: formattedReport,
        };

        reportCache.set(cacheKey, computedReport);
        console.log(`Report cached for: ${cacheKey}`);

        res.status(200).json(computedReport);
    } catch (err) {
        console.error("Error retrieving report:", err);
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
