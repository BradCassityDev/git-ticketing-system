const router = require('express').Router();

// API routes - /api/
router.use('/api', require('./api'));

// Catch and handle all other unknown routes
router.use((req, res) => {
    res.status(404).end();
});

module.exports = router;