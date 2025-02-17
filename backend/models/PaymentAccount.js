import mongoose from 'mongoose';

const paymentAccountSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  paymentAccount: {
    type: String,
    required: true,
    unique: true, // Ensure each account number is unique
  },
  accountHolderName: {
    type: String,
    required: true,
  },
  bankName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the creation date
  },
});

export default mongoose.model('PaymentAccount', paymentAccountSchema);