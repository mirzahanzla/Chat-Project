import mongoose from 'mongoose';

const querySchema  = new mongoose.Schema({
  reason: {
    type: String,
    enum: ['copyright', 'contract_cancellation', 'removed_post'],
    required: true
  },
  contractID: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Contract'
  },
  postID: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Blog'
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Resolved', 'Rejected'], 
    default: 'Pending' 
  },
  remarks: { 
    type: String 
  },
  reporterID: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Query', querySchema );