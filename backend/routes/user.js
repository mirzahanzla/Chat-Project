import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { getUserData, getProfileData, editProfileData ,getBrandData } from '../controllers/userController.js';

const router = express.Router();

// Protect this route with JWT middleware
router.get('/user-data', authMiddleware, getUserData);
router.get('/getProfileData', getProfileData);
router.get('/getBrandData ', getBrandData );
router.put('/editProfileData/:userID', editProfileData);

export default router;