import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid'; // If you want to use UUIDs, install uuid with `npm install uuid`

const groupSchema = new mongoose.Schema(
  {
    groupchatId: { 
      type: String, 
      default: () => uuidv4(), // Generate a unique ID using uuid
      unique: true // Ensure this ID is unique
    },
    title: { type: String, required: true },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    // followedGroups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
    followedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
    photo: { type: String }, // Optional: Group profile picture
    messages: [
      {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
  
);

export default mongoose.model('Group', groupSchema);
