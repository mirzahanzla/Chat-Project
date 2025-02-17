import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  notifications: [
    {
      contractID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Contract' },
      message: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
      status: { type: String, enum: ['UnRead', 'Read'], default: 'UnRead' },
    }
  ]
});

export default mongoose.model('Notification', notificationSchema);