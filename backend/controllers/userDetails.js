// controllers/userDetails.js

import getUserDetailsFromToken from '../helpers/getUserDetailsFromToken.js'; // Corrected import

export const userDetails = async (request, response) => {
  try {
    console.log('Authorization Header:', request.headers.authorization);
    console.log('Cookies:', request.cookies);

    const token = request.headers.authorization?.split(' ')[1] || ''; // Extract token from authorization header
    console.log(token);
    if (!token) {
      return response.status(401).json({ message: 'No token provided, please log in again.' });
    }

    const user = await getUserDetailsFromToken(token); // Get user details using the token
    console.log('Token User', user);
    if (user.logout) {
      return response.status(401).json({ message: user.message });
    }

    return response.status(200).json(user); // Return user details
  } catch (error) {
    return response.status(500).json({ message: error.message }); // Handle errors
  }
};
