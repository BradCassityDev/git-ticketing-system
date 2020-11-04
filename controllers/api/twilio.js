const router = require('express').Router();
const { receiveSMS, sendSMS } = require('../../utils/twilio');

// Send SMS Message - /api/twilio/sendsms
router.post('/sendsms', async (req, res) => {
    const message = req.body.message;
    const phone = req.body.phone;

    const result = await sendSMS(message, phone);

    console.log(result);
    res.send(result);
});

// Receive SMS and Response - /api/twilio/receivesms
router.post('/receivesms', (req, res, next) => {
    console.log('Received text');
    receiveSMS(req, res);
});

module.exports = router;