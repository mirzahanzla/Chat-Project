// helpers/getUserDetailsFromToken.js

import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const getUserDetailsFromToken = async (token) => {
  if (!token) {
    return { message: 'Session expired, please log in again.', logout: true };
  }
    console.log("Token in ",token);

  try {
    // eslint-disable-next-line no-undef
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id=decoded.id;
    console.log("Decoded token in ",id);
    const user = await User.findById(id);

    if (!user) {
      return { message: 'User not found.', logout: true };
    }

    return user;
  } catch (error) {
    return { message: 'Invalid or expired token.', logout: true, error: error.message };
  }
};

export default getUserDetailsFromToken; // Default export
