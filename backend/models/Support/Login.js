import mongoose from "mongoose";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const CustomerUser = new mongoose.Schema({
  userName: { type: String },
  password: { type: String, required: true },
 
},{ timestamps: true });

CustomerUser.methods.setPassword = async function (password) {
  // eslint-disable-next-line no-undef
  const salt = await bcrypt.genSalt(Number(process.env.SALT));
  this.password = await bcrypt.hash(password, salt);
};

CustomerUser.methods.generateAuthToken = function () {
    // eslint-disable-next-line no-undef
    const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    return token;
};
export default mongoose.model("CustomerUser", CustomerUser);