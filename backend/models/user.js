import mongoose from "mongoose";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  userName: { type: String },
  password: { type: String, required: true },
  userType: { type: String, required: true }, // Could be 'brand', 'influencer', etc.
  status: { type: Boolean, default: false },
  verified: { type: Boolean,default:false },
  verificationAttachment: { type : String },
  uploaded: { type: Boolean },
  followedGroups: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
    default: [], // Ensure it starts as an empty array
  },
  verifiedEmail: { type: Boolean ,default:false},
  
  earnings: { type: Number },

  // Common Fields
  fullName: { type: String },
  age: { type: Number },
  website: { type: String ,default:"Check db"},
  // Instagram id for influnencer
  // Website for Brand

  InstagramId:{ type: String ,default:"Check db"},
  photo: { type: String },
  gender: { type: String },
  followers: { type: Number },
  bio: { type: String },
  blogs: [
    {
      blogID: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }
    }
  ],
  likedPosts: [
    {
      postID: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }
    }
  ],
  savedPosts: [
    {
      postID: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }
    }
  ],

  // Brand-Specific Fields
  position: { type: String }, // Position of user in company
  companySize: { type: String }, // Size of the company
  influencersWorkedWith: { type: String }, // Store as a string range
  category: [{ type: String }], // Array of categories like 'Fashion', 'Travel', etc.
  
  // Influencer-Specific Fields
  groups: { type: Number }, // Number of groups influencer is part of
},{ timestamps: true });
userSchema.methods.setPassword = async function (password) {
  // eslint-disable-next-line no-undef
  const salt = await bcrypt.genSalt(Number(process.env.SALT));
  this.password = await bcrypt.hash(password, salt);
};

userSchema.methods.generateAuthToken = function () {
	// eslint-disable-next-line no-undef
	const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: "7d",
	});
	return token;
};

export default mongoose.model("User", userSchema);