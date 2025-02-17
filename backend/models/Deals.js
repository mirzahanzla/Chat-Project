import mongoose from 'mongoose';

const dealSchema = new mongoose.Schema({
  dealImage: { type: String, required: true },
  campaignDes: { type: String, required: true },
  taskDes: { type: String, required: true },
  category: { type: String, required: true },
  platform: { type: String, required: true },
  engagement_Rate: { type: Number, required: true },
  budget: { type: Number, required: true },
  status: { type: String, default: "Active"},
  userStatuses: [
    {
      userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      contractID: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract' },
      status: { 
        type: String, 
        required: true 
      },
      proposalID: { type: mongoose.Schema.Types.ObjectId, ref: 'Proposal' }
    }
  ]
});

export default mongoose.model('Deal', dealSchema);