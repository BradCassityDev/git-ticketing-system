var express = require('express');
var router = express.Router();
const loginRoutes = require('./loginRoutes');
const dashboardRoutes = require('./dashboardRoutes');

router.use('/dashboard', dashboardRoutes);
router.use('/', loginRoutes);

module.exports = router;