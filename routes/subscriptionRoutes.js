const express = require('express');
const { addSubscription, getSubscriptions, deleteSubscription ,getSubscriptionById} = require('../controllers/subscriptionController');
const router = express.Router();

router.post('/subscriptions', addSubscription);
router.get('/subscriptions/get/:userId', getSubscriptions);
router.delete('/subscriptions/:id', deleteSubscription);
router.get('/subscriptionById/:id', getSubscriptionById); 

module.exports = router;
