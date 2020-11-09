var express = require('express');
var router = express.Router();
const loginRoutes = require('./loginRoutes');
const adminRoutes = require('./adminRoutes');
const dashboardRoutes = require('./dashboardRoutes');

router.use('/', loginRoutes);
router.use('/admin', adminRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;