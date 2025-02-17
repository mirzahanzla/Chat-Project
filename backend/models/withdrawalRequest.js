import mongoose from "mongoose";

const withdrawalRequestSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  accountID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaymentAccount', // Reference to the payment account schema
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  processedAt: {
    type: Date,
  },
  remarks: {
    type: String,
  },

  verificationAttachment: { type : String },

});

export default mongoose.model('WithdrawalRequest', withdrawalRequestSchema);