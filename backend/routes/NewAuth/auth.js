import { Router } from "express";
import bcrypt from "bcryptjs";
import Token from "../../models/Authentication/emailVerificationTokens.js";
import sendEmail from "../../utils/sendEmail.js";
import crypto from "crypto";
import LoginToken from "../../models/Authentication/LoginToken.js";
import user from "../../models/user.js";

const router = Router();

// Export router as the default export



router.post("/", async (req, res) => {
	console.log(req.body)
	try {


		const userData = await user.findOne({ email: req.body.email, userType: req.body.userType });
		

		if (!userData)
			return res.status(401).send({ message: "Invalid Email, Password or Role" });

		const validPassword = await bcrypt.compare(
			req.body.password,
			userData.password
		);
		
		if (!validPassword)
			return res.status(401).send({ message: "Invalid Email or Password" });

		if (!userData.verifiedEmail) {
			let token = await Token.findOne({ userId: userData._id })

			if (!token) {
				token = await new Token({
					userId: userData._id,
					token: crypto.randomBytes(32).toString('hex')

				}).save()
				const url = `${process.env.REACT_APP_BASE_URL}/check/users/${userData._id}/verify/${token.token}`
				await sendEmail(userData.email, "Verify Email", url)
				return res.status(400).send({ message: "Email is sent to your email. Please Verify" })
			}

			return res.status(400).send({ message: "Email was sent to your email. Please Verify" })
		}
		



		let loginToken = await LoginToken.findOne({ userId: userData._id });

		

		if (loginToken) {
			// Token exists, send the existing token as a cookie
			res.cookie("token", loginToken.token, { maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'strict', });
			res.cookie("userId", loginToken.userId.toString(), { maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'strict', });
			res.cookie("pC", userData.status ? '1' : '0', { maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'strict' });
			res.cookie("U", userData.userType, { maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'strict' });
			// res.cookie("yourCookieName", 'b', { maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'strict' });

			return res.status(200).send({ token: loginToken.token, message: "Logged in successfully" });
		}
		console.log(userData.generateAuthToken  ); // Should log the function if defined correctly

		const token = userData.generateAuthToken();
		loginToken = await LoginToken.create({ token, userId: userData._id });
		console.log("User userid token is ")
		console.log(loginToken.token)

		// Send the new token as a cookie
		res.cookie("token", loginToken.token, { maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'strict', });
		res.cookie("pC", userData.status ? '1' : '0', { maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'strict' });
		res.cookie("userId", loginToken.userId.toString(), { maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'strict', });
		res.cookie("U", userData.userType, { maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'strict' });

		res.status(200).send({ token: loginToken.token, message: "Logged in successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});



export default router;
