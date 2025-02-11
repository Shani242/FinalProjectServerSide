const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Cost = require("../models/cost");

/**
 * GET /api/users/:id
 * Retrieves user details and total expenses
 */
router.get("/:id", async (req, res) => {
    try {
        const userId = parseInt(req.params.id);

        const user = await User.findOne({ id: userId });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const costs = await Cost.find({ userid: userId });
        const totalCost = costs.reduce((sum, cost) => sum + cost.sum, 0);

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
