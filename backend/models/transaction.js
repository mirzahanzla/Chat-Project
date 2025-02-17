import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  deductedDate: { type: Date, default: Date.now },
  estimatedReleaseDate: { type: Date, required: true }, 
  dealID: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract', required: true }, 
  influencerID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true }, 
  status: { type: String, default: 'Pending' },
  contractID: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract', required: true }, 
  transactionImage: { type: String },
});

export default mongoose.model('Transaction', transactionSchema);