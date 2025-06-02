const twilio = require('twilio');
const config = require('../config/config');

const client = twilio(config.twilio.accountSid, config.twilio.authToken);

// Function to format phone numbers (add +91 if missing)
const formatPhoneNumber = (phone) => {
  // Check if the phone number starts with +91
  return phone.startsWith('+91') ? phone : `+91${phone}`;
};

const sendSMS = async (to, message) => {
  try {
    // Format the phone number to include +91 if it's an Indian number
    const formattedPhone = formatPhoneNumber(to);

    const res = await client.messages.create({
      body: message,
      from: config.twilio.phoneNumber,
      to: formattedPhone,
    });

    console.log('📲 SMS sent:', res.sid);
  } catch (err) {
    console.error('❌ SMS error:', err.message);
  }
};

module.exports = sendSMS;
