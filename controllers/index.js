const router = require('express').Router();
const frontEndRoutes = require('./frontEnd');
// API routes - /api/
router.use('/api', require('./api'));

//views routes
router.use('/', frontEndRoutes);

// Catch and handle all other unknown routes
router.use((req, res) => {
    res.status(404).end();
});

module.exports = router;