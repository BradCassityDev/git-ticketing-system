const sendNotification = require('../utils/email-notification');

test('sendNotification sends an email to a user', () => {
  const toEmail = 'githubprojectmanager@gmail.com';
  const subject = 'Jest email sent';
  const emailText = 'This is a test';
  const replyTo = 'test@domain.com';
  const htmlText = '<b>A bold statement</b>'

  sendNotification(toEmail, subject, emailText).
    then(result => {
      expect(result.response).toMatch(/^250 2.0.0 OK/);
    });

  sendNotification(toEmail, subject + ' - replyto', emailText, replyTo).
    then(result => {
      expect(result.response).toMatch(/^250 2.0.0 OK/);
    });

  sendNotification(toEmail, subject + ' - html text', emailText, replyTo, htmlText).
    then(result => {
      expect(result.response).toMatch(/^250 2.0.0 OK/);
    });
});