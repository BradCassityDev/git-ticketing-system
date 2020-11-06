const router = require('express').Router();
const issueRoutes = require('./issueRoutes');

// Issue Routes - /api/issues/
router.use('/issues', issueRoutes);

module.exports = router;