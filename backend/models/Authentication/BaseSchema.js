import mongoose from "mongoose";
const { Schema } = mongoose;

const brandSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "allEmail",
		unique: true,
	},
	brandName: {
		type: String,
		unique: true,  // Ensure brand name is unique
	},
	brandUserName: {
		type: String,
		unique: true,  // Ensure brand name is unique
	},

	basicDetails: {
		type: Object,  // Object to hold key-value pairs
		default: {},   // Default to an empty object if not provided
	},
	companyDetails: {
		type: Object,  // Object to hold key-value pairs
		default: {},   // Default to an empty object if not provided
	},
	imageUrl: {
		type: String,  // This will store the path to the uploaded image
		required: false,  // imageUrl is optional
	},
	// Additional brand-specific fields can go here
});

const influencerSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		required: true,  // userId is mandatory
		ref: "allEmail",  // Ensure 'allEmail' model is correctly set up
		unique: true,  // Enforces unique userId for each influencer
	},
	fullName: {
		type: String,
		required: false,  // fullName is optional
	},
	userName: {
		type: String,
		required: false,  // brandName is optional
	},
	gender: {
		type: String,
		enum: ["Male", "Female", "Other"],  // Example validation
		required: false,  // gender is optional
	},
	age: {
		type: Number,
		// Example: Minimum age validation
		required: false,  // age is optional
	},
	category: {
		type: String,
		required: false,  // category is optional
	},
	imageUrl: {
		type: String,  // This will store the path to the uploaded image
		required: false,  // imageUrl is optional
	},
});

const userSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		required: true,  // userId is mandatory
		ref: "allEmail",  // Ensure 'allEmail' model is correctly set up
		unique: true,  // Enforces unique userId for each influencer
	},
	fullName: {
		type: String,
		required: false,  // fullName is optional
	},
	userName: {
		type: String,
		required: false,  // brandName is optional
	},
	gender: {
		type: String,
		enum: ["Male", "Female", "Other"],  // Example validation
		required: false,  // gender is optional
	},
	age: {
		type: Number,
		// Example: Minimum age validation
		required: false,  // age is optional
	},
	category: {
		type: String,
		required: false,  // category is optional
	},
	imageUrl: {
		type: String,  // This will store the path to the uploaded image
		required: false,  // imageUrl is optional
	},
});




const Brand = mongoose.model("brand", brandSchema);
const Influencer = mongoose.model("influencer", influencerSchema);
const Auidence = mongoose.model("auidence", userSchema);

module.exports = { Brand, Influencer, Auidence };
