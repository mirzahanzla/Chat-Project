import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';

export const signUp = async (req, res) => {
  const { email, password, userType } = req.body;

  if (!userType) {
    return res.status(400).json({ message: 'User type is required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the newUser object with conditional "verified" field
    const newUserData = {
      email,
      password: hashedPassword,
      userType,
      status: 'incomplete',
      ...(userType === 'influencer' && { verified: false }) // Add "verified: false" only if userType is "influencer"
    };

    const newUser = new User(newUserData);
    await newUser.save();

    // Generate a JWT token
    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },  // Payload
      process.env.JWT_SECRET,                     // Secret key
      { expiresIn: '7d' }
    );

    res.status(201).json({ message: 'User registered successfully', userId: newUser._id, token });
  } catch (error) {
    console.error('Sign-up error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password, userType } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User does not exist' });

    

    if (userType && user.userType !== userType) {
      return res.status(400).json({ message: 'User type does not match' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate a JWT token
    const token = jwt.sign(
      { email: user.email, id: user._id },    // Payload
      process.env.JWT_SECRET,                 // Secret key
      { expiresIn: '7d' }
    );

    res.status(200).json({ result: user, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getUserID = (req, res) => {
  const authHeader = req.headers.authorization; // Authorization token

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token is missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) return res.status(400).json({ message: 'Token is required' });

  try {
    // Decode the token to extract user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ userID: decoded.id }); // Send the user ID in the response
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const verifyToken = async (req, res) => {
  const authHeader = req.headers.authorization;// Authorization token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token is missing or invalid' });
  }
  const token = authHeader.split(' ')[1];
  console.log("user is ")
  console.log(token)


  if (!token) return res.status(400).json({ message: 'Token is required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
    const user = await User.findById(decoded.id);

    if (!user) return res.status(400).json({ message: 'User not found' });

    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    res.status(200).json({ user });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const deleteUser = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};