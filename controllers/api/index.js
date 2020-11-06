const router = require('express').Router();
const userRoutes = require('./user-routes');
const issueRoutes = require('./issue-routes');
const githubRoutes = require('./github');

// User Routes - /api/user
router.use('/user', userRoutes);

// Issue Routes - /api/issues
router.use('/issues', issueRoutes);

module.exports = router;