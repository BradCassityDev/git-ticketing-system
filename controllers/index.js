const router = require('express').Router();

// Catch and handle all other unknown routes
router.use((req, res) => {
    res.status(404).end();
});

module.exports = router;