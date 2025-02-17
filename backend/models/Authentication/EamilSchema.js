import mongoose  from "mongoose";
import jwt from 'jsonwebtoken'

import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
	email: { type: String, required: true },
	password: { type: String, required: true },
	verified: { type: Boolean, default: false },
	role: { type: String, required: true },
	profileCompleted: { type: Boolean, default: false },
});

const passwordResetTokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'emails', required: true },
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: '1h' } // Token expires in 1 hour
});



userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
		expiresIn: "7d",
	});
	return token;
};


userSchema.methods.setPassword = async function (password) {
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    this.password = await bcrypt.hash(password, salt);
};


const EamilSchema = mongoose.model("emails", userSchema);







const PasswordResetTokens = mongoose.model('PasswordResetToken', passwordResetTokenSchema);



export  { EamilSchema , PasswordResetTokens};
