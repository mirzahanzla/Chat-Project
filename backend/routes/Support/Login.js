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


		const userData = await user.findOne({ email: req.body.email });
		

		if (!userData)
			return res.status(401).send({ message: "Invalid Email or Password " });

		const validPassword = await bcrypt.compare(
			req.body.password,
			userData.password
		);
		
		if (!validPassword)
			return res.status(401).send({ message: "Invalid Email or Password" });




	

		// Send the new token as a cookie
		res.cookie("U", 'C', { maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'strict' });

	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});



export default router;
