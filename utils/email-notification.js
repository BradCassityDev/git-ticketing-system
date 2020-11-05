const nodemailer = require('nodemailer');
require('dotenv').config();

function sendNotification(toEmail, subject, text, replyToEmail, htmlText) {
  // Create a SMTP transporter object
  let transporter = nodemailer.createTransport({
    service: process.env.NOTIFY_EMAIL_SERVICE,
    auth: {
      user: process.env.NOTIFY_EMAIL_ADDR,
      pass: process.env.NOTIFY_EMAIL_PW
    }
  });

  // Message object
  let message = {
    // Who the email will appear to be from
    from: process.env.NOTIFY_EMAIL_ADDR,

    // Comma separated list of recipients
    to: toEmail,

    // Subject of the message
    subject: subject,

    // Plaintext body
    text: text
  };

  // Set reply-to field if it is not empty
  if (replyToEmail !== '') {
    message.replyTo = replyToEmail;
  }

  // Set HTML text for message if it is not empty
  if (htmlText !== '') {
    message.html = htmlText;
  }

  let emailResult = transporter.sendMail(message);

  return emailResult;
}

module.exports = sendNotification;
