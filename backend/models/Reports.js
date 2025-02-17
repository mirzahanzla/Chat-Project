import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  Name: { type: String, required: true, unique: true },
  fullName: { type: String },
  AvgEngagementRate: { type: Number, required: true },
  FollowerCount: { type: Number, required: true },
  NoOfPosts: { type: Number, required: true },
  SumOfComments: { type: Number, required: true },
  SumOfEngagements: { type: Number, required: true },
  SumOfLikes: { type: Number, required: true }
});

export default mongoose.model('Report', reportSchema);