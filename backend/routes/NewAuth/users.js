import { Router } from "express";

import bcrypt from "bcryptjs";


import crypto from "crypto";
import user from '../../models/user.js'
import {  PasswordResetTokens } from '../../models/Authentication/EamilSchema.js';


import emailVerificationTokens from '../../models/Authentication/emailVerificationTokens.js'
import LoginToken from "../../models/Authentication/LoginToken.js";
import sendEmail from "../../utils/sendEmail.js";


const router = Router();

// Export router as the default export



router.post("/", async (req, res) => {
    try {
  
        // const { error } = validate(req.body);
        // if (error)
        //     return res.status(400).send({ message: error.details[0].message });

        let userData = await user.findOne({ email: req.body.email });
        if (userData)
            return res.status(409).send({ message: "User with given email already Exist!" });

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        userData = await new user({
            ...req.body
            , password: hashPassword,
            
        }).save();


      

        const token = await new emailVerificationTokens({
            userId: userData._id,
            token: crypto.randomBytes(32).toString('hex')
        }).save();

        const url = `${process.env.REACT_APP_BASE_URL}/check/users/${userData._id}/verify/${token.token}`;
        await sendEmail(userData.email, "Verify Email", url);
        res.setHeader('Access-Control-Allow-Credentials', 'true');

        res.status(201).send({ message: `An Email sent to please Verify `,email:userData.email });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" + error });
    }
});

router.get('/:id/verify/:token', async (req, res) => {
    try {
        console.log("PArams is ")
        console.log(req.params);
        
        // Find the user by ID
        const userData = await user.findOne({ _id: req.params.id });
        if (!userData) return res.status(400).send({ message: "Invalid user link", check: "" });

        // Check if the user is already verified
        if (userData.verifiedEmail) {
            return res.status(200).send({ message: "Email already verified", check: "already_verified" });
        }

        // Find the token
        const token = await emailVerificationTokens.findOne({
            userId: userData._id,
            token: req.params.token
        });

        if (!token) return res.status(400).send({ message: "Invalid token link", check: "" });

        // Update the user's verification status
        await user.updateOne({ _id: userData._id }, { verifiedEmail: true });
        // Delete the token
        await emailVerificationTokens.findByIdAndDelete(token._id);
        res.status(200).send({ message: "Email verified successfully", check: "1" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

router.post("/resend", async (req, res) => {
    try {
        const { email } = req.body;

        console.log("Email is"+email);

        // Find the user by email
        const userData = await user.findOne({ email });
        if (!userData) {
            return res.status(404).send({ message: "User with given email does not exist!" });
        }

        // Check if the user is already verified
        if (userData.isVerified) {
            return res.status(400).send({ message: "This email has already been verified." });
        }

        // Generate a new token or reuse existing unexpired token
        let token = await emailVerificationTokens.findOne({ userId: userData._id });
        if (!token) {
            token = await new emailVerificationTokens({
                userId: userData._id,
                token: crypto.randomBytes(32).toString('hex')
            }).save();
        }

        // Create verification URL
        const url = `${process.env.REACT_APP_BASE_URL}/check/users/${userData._id}/verify/${token.token}`;
        
        // Send email
        await sendEmail(userData.email, "Resend Email Verification", url);

        res.status(200).send({ message: "Verification email has been resent.", email: userData.email });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});


router.post('/reset', async (req, res) => {
  
    try {
       

        let userData = await user.findOne({ email: req.body.email });
        console.log(user);
    
        if (!userData)
            return res.status(404).send({ message: "User with given email does not exist!" });

        // Generate a password reset token
        const token = await new PasswordResetTokens({
            userId: userData._id,
            token: crypto.randomBytes(32).toString('hex')
        }).save();

        const url = `${process.env.REACT_APP_BASE_URL}/check/users/${userData._id}/reset-password/${token.token}`;
        await sendEmail(userData.email, "Reset Your Password", url);

        res.status(200).send({ message: `Password reset email sent to ${userData.email}` });
    } catch (error) {
        console.error("Internal Server Error: ", error); // Improved error logging
        res.status(500).send({ message: "Internal Server Error" });
    }
});


// Endpoint to validate the reset token
router.get('/validate-reset-token/:token', async (req, res) => {
   
    const {token}=req.params

    if (!token) {
        return res.status(400).send({ error: 'Token is required.' });
    }

    try {
        // Find the token in the database
        const resetToken = await PasswordResetTokens.findOne({ token });

        if (!resetToken) {
            return res.status(400).send({ valid: false, error: 'Invalid token.' });
        }

       

        // If token is valid and user exists
        res.status(200).send({ valid: true });
    } catch (err) {
        console.error('Error validating token:', err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).send({ error: 'Token and new password are required.' });
    }

    try {
        // Find the reset token in the database
        const resetToken = await PasswordResetTokens.findOne({ token });

        if (!resetToken) {
            return res.status(400).send({ message: 'Invalid or expired token.' });
        }

        // Find the user associated with the token
        const userData = await user.findById(resetToken.userId);

        if (!userData) {
            return res.status(400).send({ message: 'User not found.' });
        }

        // Set and hash the new password
        await userData.setPassword(newPassword);
        await userData.save();

        // Remove the used token from the database
        await PasswordResetTokens.deleteOne({ token });

        res.status(200).send({ message: 'Password has been reset successfully.' });
    } catch (err) {
        console.error('Error resetting password:', err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

export default router;
