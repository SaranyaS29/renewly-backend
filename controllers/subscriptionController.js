const Subscription = require('../models/Subscription');
const mongoose = require('mongoose');

// Add Subscription
exports.addSubscription = async (req, res) => {
  try {
    const { userId, name, cost, renewalDate } = req.body;
    
    if (!userId || !name || !cost || !renewalDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Convert userId to ObjectId
    const userIdObjectId = new mongoose.Types.ObjectId(userId);

    const newSubscription = new Subscription({ 
      userId: userIdObjectId, 
      name, 
      cost: parseFloat(cost), 
      renewalDate: new Date(renewalDate) 
    });
    
    const savedSubscription = await newSubscription.save();
    res.status(201).json({
      message: 'Subscription added successfully',
      subscription: savedSubscription
    });
  } catch (error) {
    console.error('Error adding subscription:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    res.status(500).json({ message: 'Error adding subscription', error: error.message });
  }
};

// Get Subscriptions
exports.getSubscriptions = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Fetching subscriptions for userId:", userId);
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Convert userId to ObjectId
    const userIdObjectId = new mongoose.Types.ObjectId(userId);
    const subscriptions = await Subscription.find({ userId: userIdObjectId });
    res.status(200).json(subscriptions);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    res.status(500).json({ message: 'Error fetching subscriptions', error: error.message });
  }
};

// Delete Subscription
exports.deleteSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: 'Subscription ID is required' });
    }

    const deletedSubscription = await Subscription.findByIdAndDelete(id);
    
    if (!deletedSubscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    res.status(200).json({ 
      message: 'Subscription deleted successfully',
      subscription: deletedSubscription
    });
  } catch (error) {
    console.error('Error deleting subscription:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid subscription ID format' });
    }
    res.status(500).json({ message: 'Error deleting subscription', error: error.message });
  }
};

exports. getSubscriptionById = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) return res.status(404).json({ message: 'Subscription not found' });
    res.json(subscription);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
