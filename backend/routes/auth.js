import express from 'express';
import { signUp , login, verifyToken, deleteUser, getUserID } from '../controllers/authController.js';
import {userDetails} from '../controllers/userDetails.js';
// import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.get('/verifyToken', verifyToken);
router.delete('/deleteUser/:userId', deleteUser);
router.get('/getID', getUserID);


// Route to get logged-in user details
router.get('/getLoggedInUser',  userDetails);

export default router;