import mongoose from 'mongoose';

const instaMediaSchema = new mongoose.Schema({
  postImageSrc: { type: String, required: true },
  instaPostID: { type: String, required: true },
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  contractID: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract', required: true },
  brandID: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
  influencerID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

export default mongoose.model('InstaMedia', instaMediaSchema);