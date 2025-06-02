// const mongoose = require('mongoose');

// const notificationSchema = new mongoose.Schema({
//   subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', required: true },
//   daysBefore: Number,
//   ringtone: String,
//   phone: { type: String },
//   email: { type: String }
// });

// module.exports = mongoose.model('Notification', notificationSchema);

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', required: true },
  renewalDate: { type: String, required: true }, 
  payment:{type:Number,required : true},// ✅ Added this line
  daysBefore: Number,
 
  phone: { type: String },
  email: { type: String },
  platform:{ type: String , required:true }
});

module.exports = mongoose.model('Notification', notificationSchema);

