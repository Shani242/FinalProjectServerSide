const express = require('express');
const router = express.Router();

/**
 * @module routes/about
 *
 * This route provides information about the development team.
 */

/**
 * GET /api/about
 * @description Returns information about the development team
 * @route {GET} /api/about
 * @returns {Array<Object>} Array of team members with their first and last names
 */
router.get('/', (req, res) => {
    res.json([
        { first_name: 'Shirly', last_name: 'Avrahamoff' },
        { first_name: 'Shani', last_name: 'Zicher' }
    ]);
});

module.exports = router;
