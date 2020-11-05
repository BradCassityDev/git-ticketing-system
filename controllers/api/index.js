const router = require('express').Router();

// /api/twilio/sendsms
router.use('/twilio', require('./twilio'));

module.exports = router;