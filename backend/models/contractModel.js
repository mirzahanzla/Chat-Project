import mongoose from 'mongoose';

const contractSchema = new mongoose.Schema({
  milestones: [{
    budget: { type: Number, required: true },
    posts: { type: Number, required: true },
    deadline: { type: Date, required: true },
    startedDate: { type: Date, default: Date.now },
    status: { type: String },
    revisions: { type: Number, default: 0 },
    postLinks: [{
      instaPostID: { type: mongoose.Schema.Types.ObjectId, ref: 'Media' }
    }]
  }],
  deliverables: { type: String, required: true },
  proposalID: { type: mongoose.Schema.Types.ObjectId, ref: 'Proposal' },
  influencerID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dealID: { type: mongoose.Schema.Types.ObjectId, ref: 'Deal', required: true }
});

export default mongoose.model('Contract', contractSchema);