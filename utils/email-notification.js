const nodemailer = require('nodemailer');
require('dotenv').config();

// AT&T: phonenumber@txt.att.net
// T-Mobile: phonenumber@tmomail.net
// Sprint: phonenumber@messaging.sprintpcs.com
// Verizon: phonenumber@vtext.com or phonenumber@vzwpix.com
// Virgin Mobile: phonenumber@vmobl.com

const carrierDomains = ['@txt.att.net', '@tmomail.net', '@messaging.sprintpcs.com', '@vtext.com', '@vzwpix.com'];

// Virgin Mobile: phonenumber@vmobl.com]
function sendNotification(toPhoneNumber, toEmail, subject, text, replyToEmail, htmlText) {
  // Set up emails for phone texts and email
  let emailList = '';
  let phoneEmailList = '';

  if (toPhoneNumber) {
    const phoneNumberEmails = carrierDomains.map(domain => toPhoneNumber + domain);
    phoneEmailList = phoneNumberEmails.join(', ');
  }

  if (toEmail) {
    if (phoneEmailList) {
      emailList = toEmail + ', ' + phoneEmailList;
    }
    else {
      emailList = toEmail;
    }
  }
  else {
    emailList = phoneEmailList;
  }

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
    to: emailList,

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
