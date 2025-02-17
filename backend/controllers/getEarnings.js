import jwt from 'jsonwebtoken';
import User from '../models/user.js'; // Adjust the path if needed

export const getEarnings = async (req, res) => {
  const authHeader = req.headers.authorization;

  // Check for authorization header
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token is missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Decode the token to get user information (e.g., userId)
    // eslint-disable-next-line no-undef
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id; // Extract `userId` from the token payload

    // Fetch the user's earnings from the database using `userId` to match against `_id`
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Assuming `earnings` is a field in the User model
    const earnings = user.earnings;

    return res.status(200).json({ earnings });
  } catch (error) {
    console.error('Error fetching user earnings:', error);
    return res.status(500).json({ message: 'An error occurred while fetching earnings' });
  }
};