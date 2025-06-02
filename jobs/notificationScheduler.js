const cron = require('node-cron');
const Notification = require('../models/Notification');
const sendEmail = require('../services/sendEmail');
const sendSMS = require('../services/sendSMS');

const moment = require('moment'); // For date manipulation

cron.schedule('55 7 * * *', async () => {
    console.log('⏰ Running scheduled notification check at 7:48 AM...');

  try {
    const notifications = await Notification.find({});

    const today = moment().startOf('day');

    for (const notif of notifications) {
      const { renewalDate, daysBefore, phone, email, platform, payment } = notif;

      if (!renewalDate || !daysBefore) continue;

      const targetDate = moment(renewalDate).subtract(daysBefore, 'days').startOf('day');

      if (today.isSame(targetDate)) {
        const formattedDate = moment(renewalDate).format('DD-MM-YYYY');

        // Send SMS
        if (phone) {
          try {
            const smsMessage = `📢 Reminder: Your subscription for ${platform} is due on ${formattedDate}. You've set a reminder ${daysBefore} day(s) early. Payment: ₹${payment}.`;
            await sendSMS(phone, smsMessage);
            console.log(`✅ SMS sent to ${phone}`);
          } catch (smsErr) {
            console.error(`❌ Error sending SMS to ${phone}:`, smsErr.message);
          }
        }

        // Send Email
        if (email) {
          try {
            const emailMessage = `Hello,\n\nThis is a reminder that your subscription for ${platform} is due on ${formattedDate}. You've asked to be reminded ${daysBefore} day(s) before.\n\nPayment Amount: ₹${payment}\n\nThank you!`;
            await sendEmail(email, '🔔 Subscription Reminder', emailMessage);
            console.log(`✅ Email sent to ${email}`);
          } catch (emailErr) {
            console.error(`❌ Error sending Email to ${email}:`, emailErr.message);
          }
        }
      }
    }

  } catch (err) {
    console.error('❌ Error in notification scheduler:', err.message);
  }
});
