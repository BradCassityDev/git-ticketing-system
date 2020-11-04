// Twilio SMS Utility Functions
const MessagingResponse = require('twilio').twiml.MessagingResponse;

// handle incoming sms messages
function receiveSMS(req, res) {
    const twiml = new MessagingResponse();
    const message = req.body.Body;
    const responseSMS = 'Hello group!';

    twiml.message(responseSMS);
    
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    console.log('Response sent');
    res.end(twiml.toString());
}

// send outgoing sms message
// Expects message as string
async function sendSMS(message, phone) {
    const client = require('twilio')(process.env.TWILIO_ACCT_SID, process.env.TWILIO_AUTH_TOKEN);
    
    const result = await client.messages
      .create({
         body: message,
         from: '+12054798595',
         to: phone
       })
      .then(message => {
        console.log(message.sid);
        return 'Message sent';
      })
      .catch(err => err);

    return result;
}

module.exports = {
    receiveSMS,
    sendSMS
}