const router = require('express').Router();
const userRoutes = require('./user-routes');
const projectRoutes = require('./project-routes');
const ticketRoutes = require('./ticket-routes');
const issueRoutes = require('./issue-routes');

router.use('/user', userRoutes);
router.use('/ticket', ticketRoutes);
router.use('/project', projectRoutes);
router.use('/issues', issueRoutes);

module.exports = router;