const nodemailer = require('nodemailer');
const config = require('../config/config');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

const sendEmail = async (to, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: `"Notification Service" <${config.email.user}>`,
      to,
      subject,
      text,
    });
    console.log('📧 Email sent:', info.response);
  } catch (err) {
    console.error('❌ Email error:', err.message);
  }
};

module.exports = sendEmail;
