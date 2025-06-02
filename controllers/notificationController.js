const Notification = require('../models/Notification');
const sendEmail = require('../services/sendEmail');
const sendSMS = require('../services/sendSMS');
const mongoose = require('mongoose');

exports.getNotification = async (req, res) => {
  try {
    const notif = await Notification.findOne({ subscriptionId: req.params.subscriptionId });
    res.json(notif || {});
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notification' });
  }
};





exports.setNotification = async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const { renewalDate, payment,daysBefore, phone, email,platform } = req.body;

    console.log("Incoming data:", { daysBefore, phone, email, renewalDate, subscriptionId,platform ,payment});

    // Convert subscriptionId to ObjectId
    const objectId = new mongoose.Types.ObjectId(subscriptionId); // Convert to ObjectId

    // Format date as DD-MM-YYYY
    const date = new Date(renewalDate);
    const formattedDate = `${("0" + date.getDate()).slice(-2)}-${("0" + (date.getMonth() + 1)).slice(-2)}-${date.getFullYear()}`;

    const updateData = { daysBefore, subscriptionId: objectId, phone, email, renewalDate: formattedDate ,platform,payment};

    // Check if Notification exists for the given subscriptionId
    const existing = await Notification.findOne({ subscriptionId: objectId });
    console.log("Existing notification:", existing);

    if (existing) {
      // If notification exists, update it
      console.log("Updating existing notification...");
      await Notification.updateOne({ subscriptionId: objectId }, updateData);
    } else {
      // If no notification exists, create a new one
      console.log("Creating new notification...");
      const notif = new Notification(updateData);
      await notif.save();
    }

    // Sending Notifications if phone or email is provided
    if (phone) {
      try {
        console.log("Sending SMS...");
        await sendSMS(phone, `📢 Reminder set ${daysBefore} day(s) before the renewal of your subscription on the platform ${platform}, scheduled for ${formattedDate}. Your payment amount is ${payment}.`);
      } catch (smsErr) {
        console.error('Error sending SMS:', smsErr.message);
      }
    }
    
    if (email) {
      try {
        console.log("Sending Email...");
        await sendEmail(email, '🔔 Notification Set', `Your reminder is set ${daysBefore} day(s) before the renewal date: ${formattedDate} of the platform ${platform}. Your payment amount is ${payment}.`);
      } catch (emailErr) {
        console.error('Error sending Email:', emailErr.message);
      }
    }
    
    // Respond with a success message
    res.json({ message: 'Notification saved and sent successfully.' });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ message: 'Error saving or sending notification' });
  }
};