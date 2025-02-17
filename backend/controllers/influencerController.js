import User from '../models/user.js';
import { storage } from '../config/firebase.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getInstagramProfileData } from '../controllers/extracter.js';

export const saveInfluencerInfo = async (req, res) => {
  const { userId, fullName, age, website, gender, category } = req.body;
  const photo = req.file;


  try {
    if (!photo.mimetype.startsWith('image/')) {
      console.error('Invalid file type. File type:', photo.mimetype);
      return res.status(400).json({ message: 'Invalid file type. Please upload an image.' });
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (photo.size > maxSize) {
      console.error('File size exceeds limit. File size:', photo.size);
      return res.status(400).json({ message: 'File size exceeds the 5MB limit.' });
    }

    // Fetch Instagram profile data
    // const profileData = await getInstagramProfileData(website);
    
    // if (parseInt(profileData.followers) < 200000) {
    //   return res.status(400).json({ message: "User can't have followers less than 200k." });
    // }

    // Handle the image upload to Firebase Storage
    const photoRef = ref(storage, `images/${Date.now()}_${photo.originalname}`);
    await uploadBytes(photoRef, photo.buffer);
    const photoURL = await getDownloadURL(photoRef);

    // Update user information, including the Instagram username
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        fullName, 
        age, 
        website, 
        photo: photoURL, 
        gender, 
        category,
        status: true,
      },
      { new: true } 
    );

    if (updatedUser) {

      res.cookie("pC", '1', {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
        sameSite: 'strict',
        path: '/', 
      });
      res.status(200).json({ message: 'User information added and status updated successfully', user: updatedUser });
    } else {
      console.error('User not found:', userId);
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Save influencer info error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const saveUserInfo = async (req, res) => {
  const { userId, fullName, age, website, gender, category } = req.body;
  const photo = req.file;

  try {
    if (!photo.mimetype.startsWith('image/')) {
      console.error('Invalid file type. File type:', photo.mimetype);
      return res.status(400).json({ message: 'Invalid file type. Please upload an image.' });
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (photo.size > maxSize) {
      console.error('File size exceeds limit. File size:', photo.size);
      return res.status(400).json({ message: 'File size exceeds the 5MB limit.' });
    }

    // Handle the image upload to Firebase Storage
    const photoRef = ref(storage, `images/${Date.now()}_${photo.originalname}`);
    await uploadBytes(photoRef, photo.buffer);
    const photoURL = await getDownloadURL(photoRef);

    // Update user information, including the Instagram username
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        fullName, 
        age, 
        website, 
        photo: photoURL, 
        gender, 
        category,
        status: 'complete',
      },
      { new: true } 
    );

    if (updatedUser) {
      res.status(200).json({ message: 'User information added and status updated successfully', user: updatedUser });
    } else {
      console.error('User not found:', userId);
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Save influencer info error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};