import User from '../models/user.js';
import jwt from 'jsonwebtoken'; 

export const getUserData = async (req, res) => {
  try {
    const userId = req.userId;  // Set by the auth middleware
    const user = await User.findById(userId).select('-password');  // Exclude the password field

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getProfileData = async (req, res) => {
  try {
   
    // Extract the token from the authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token is required' });
    }

    // Extract the token and verify it
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your JWT secret key

    // Use the decoded ID to find the user
    const userId = decoded.id;
    const user = await User.findById(userId);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user data (excluding password and other sensitive fields)
    res.status(200).json({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      age: user.age,
      gender: user.gender,
      userType: user.userType,
      status: user.status,
      photo: user.photo,
      website: user.website,
      category: user.category,
      likedPosts: user.likedPosts,
      savedPosts: user.savedPosts,
      blogs: user.blogs,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getBrandData = async (req, res) => {
  try {
   
    // Extract the token from the authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token is required' });
    }

    // Extract the token and verify it
    const token = authHeader.split(' ')[1];
    // eslint-disable-next-line no-undef
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your JWT secret key

    // Use the decoded ID to find the user
    const userId = decoded.id;
    const user = await User.findById(userId);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user data (excluding password and other sensitive fields)
    res.status(200).json({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      userType: user.userType,
      photo: user.photo,
      category: user.category,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const editProfileData = async (req, res) => {
  const { userID } = req.params; // Get the userId from the URL parameters
  const { fullName, age, gender } = req.body; // Get new data from the request body

  try {
    // Find the user by ID
    const user = await User.findById(userID);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user data
    user.fullName = fullName !== undefined ? fullName : user.fullName; // Update fullName if provided
    user.age = age !== undefined ? age : user.age; // Update age if provided
    user.gender = gender !== undefined ? gender : user.gender; // Update gender if provided

    // Save the updated user data
    await user.save();

    // Respond with the updated user data
    return res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};
