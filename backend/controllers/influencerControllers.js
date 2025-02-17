import User from '../models/user.js';
import { storage } from '../config/firebase.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import mongoose from 'mongoose';
import Brand from '../models/brands.js'; // Assuming you have a Brand model

export const saveInfluencerIn = async (req, res) => {
  const { userId,brandUserName, position, companySize, influencersWorkedWith, brandName, website, category } = req.body;
 console.log("Brand is ")
 console.log(req.body)
  const logo = req.file;

  if (!logo) {
    return res.status(400).json({ message: 'No logo file uploaded.' });
  }


  try {
    // Validate that the uploaded file is an image
    if (!logo.mimetype.startsWith('image/')) {
      console.error('Invalid file type. File type:', logo.mimetype);
      return res.status(400).json({ message: 'Invalid file type. Please upload an image.' });
    }

    // Check file size (limit: 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (logo.size > maxSize) {
      console.error('File size exceeds limit. File size:', logo.size);
      return res.status(400).json({ message: 'File size exceeds the 5MB limit.' });
    }

    // Check if brandName is unique
    const existingBrand = await User.findOne({ fullName: brandName }); // Ensure it runs in the transaction
    if (existingBrand) {
      return res.status(400).json({ message: 'Brand name already exists.' });
    }

    // Upload the logo to Firebase Storage
    const logoRef = ref(storage, `logos/${Date.now()}_${logo.originalname}`);
    await uploadBytes(logoRef, logo.buffer);
    const logoURL = await getDownloadURL(logoRef);

    // Update the user information in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        position,       
        userName: brandUserName,
        companySize,
        influencersWorkedWith,
        fullName: brandName,
        website,
        photo: logoURL,
        category,
        status: true
      },
      { new: true } // Return the updated document
    );
    
    console.log('Updated User:', updatedUser);

    if (updatedUser) {
      // Find or create the brand
      let brand = await Brand.findOne({ brandName: updatedUser.fullName }); // Ensure it runs in the transaction
      if (!brand) {
        // Create a new brand if not found
        brand = new Brand({
          brandID: updatedUser._id,
          brandName: updatedUser.fullName,
          brandImage: updatedUser.photo,
        });
        await brand.save(); // Save the brand in the transaction
      }

 // End the session

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