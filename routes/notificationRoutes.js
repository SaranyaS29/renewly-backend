const express = require('express');
const router = express.Router();
const {
  getNotification,
  setNotification,

} = require('../controllers/notificationController');

router.post('/setNotif/:subscriptionId', (req, res, next) => {
  console.log('🔔 Route hit with ID:', req.params.subscriptionId);
  next();
}, setNotification);

router.get('/getNotif/:subscriptionId', getNotification);

module.exports = router;
