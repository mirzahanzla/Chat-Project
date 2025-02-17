import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
  status: { type: String, default: 'draft' },
  imageLink: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  instructions: {type: String}
});

export default mongoose.model('Media', mediaSchema);