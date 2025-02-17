import jwt from 'jsonwebtoken';
import { storage } from '../config/firebase.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import User from '../models/user.js'; // Ensure User is imported from your Mongoose model

export const uploadVerificationAttachment = async (req, res) => {
  const authHeader = req.headers.authorization;
console.log("in the verificationo portal")
  // Authorization Header Check
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token is missing or invalid' });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    // Decode token to get userID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userID = decoded.id;

    // Find the user in the database
    const user = await User.findById(userID);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has already uploaded an attachment and if approved is true
    if (user.verificationAttachment && user.approved) {
      return res.status(400).json({ message: 'You have already uploaded a verification attachment and it is approved. Cannot upload again.' });
    }

    // File Existence Check
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Define Firebase Storage Path
    const fileName = `verificationAttachments/${userID}-${Date.now()}`;
    const fileRef = ref(storage, fileName);

    // Upload file to Firebase Storage and get download URL
    const snapshot = await uploadBytes(fileRef, req.file.buffer);
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Update User Document in MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      userID,
      { 
        verified: false, 
        verificationAttachment: downloadURL,
        uploaded: true // Reset approved to false as the user is re-uploading
      },
      { new: true }
    );

    // Success Response
    res.status(200).json({ message: 'Verification attachment uploaded', user: updatedUser });

  } catch (error) {
    console.error('Error uploading verification attachment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getVerificationStatus = async (req, res) => {
  const authHeader = req.headers.authorization;

  // Authorization Header Check
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token is missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Decode token to get userID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userID = decoded.id;

    // Find the user in the database
    const user = await User.findById(userID);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prepare the response with the user's verification status
    const verificationStatus = {
      verificationAttachment: user.verificationAttachment,  // Attachment URL or details
      uploaded: user.uploaded,  // If the attachment is approved
      verified: user.verified,  // Overall verification status
    };

    // Send the status response
    res.status(200).json({ message: 'Verification status fetched successfully', verificationStatus });

  } catch (error) {
    console.error('Error fetching verification status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
