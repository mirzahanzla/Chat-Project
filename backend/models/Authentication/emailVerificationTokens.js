import mongoose from "mongoose"; // Import mongoose as an ES6 module
const { Schema } = mongoose; // Destructure Schema directly from mongoose

const tokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "alls",
    unique: true
  },
  token: {
    type: String,
    required: true
  },
  createdAt: { type: Date, default: Date.now, expires: 3600 } // 1 Hour TTL
});

const EmailVerificationToken = mongoose.model("emailVerificationTokens", tokenSchema);

export default EmailVerificationToken; // Export the model
