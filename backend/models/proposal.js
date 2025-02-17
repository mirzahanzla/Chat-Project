import mongoose from 'mongoose';

const proposalSchema = new mongoose.Schema({
  budget: { type: Number, default: 10, min: 10 }, // Minimum 10
  coverLetter: { type: String, trim: true, required: true }, // Ensure cover letter is filled
  link: { type: String, trim: true },
  sentAt: { type: Date, default: Date.now },
  posts: { type: Number, default: 1, min: 1 }, // Minimum 1 post
  deadline: { type: Date, validate: { validator: (v) => v > Date.now(), message: 'Deadline must be a future date' } }, // Deadline must be after today
  revisions: { type: Number, default: 1, min: 0 } // Minimum 0 revisions
}, {
  timestamps: true
});

export default mongoose.model('Proposal', proposalSchema);