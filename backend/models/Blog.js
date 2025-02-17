import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  body: { type: String, default: '', required: true },
  timeStamp: { type: Date, default: Date.now }
}, { _id: false });  // Disable automatic _id field for comments

const monthlyInteractionSchema = new mongoose.Schema({
  likes: { type: Number, default: 0 },
  commentedBy: {
    type: Map,  // Map where userID is the key and array of comments is the value
    of: [commentSchema],
    default: {}
  },
  reach: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  visits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { _id: false });

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  postedAt: { type: Date, default: Date.now },
  monthlyInteraction: {
    type: Map,
    of: monthlyInteractionSchema,
    default: {}
  },
  blogMainImg: { type: String, required: true }
}, { _id: true });

const blogsSchema = new mongoose.Schema({
  month: { type: String, required: true },
  blogPosts: [blogPostSchema]
});

export default mongoose.model('Blog', blogsSchema);