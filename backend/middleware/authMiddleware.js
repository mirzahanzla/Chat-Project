// import jwt from 'jsonwebtoken';

// export const authMiddleware = (req, res, next) => {
//   try {
//     const token = req.headers.authorization.split(' ')[1]; // Expect "Bearer <token>"

//     if (!token) return res.status(401).json({ message: 'No token provided, authorization denied' });

//     const decodedData = jwt.verify(token, process.env.JWT_SECRET);

//     req.userId = decodedData?.id; 
//     next();
//   } catch (error) {
//     console.error('Authorization error:', error);
//     res.status(401).json({ message: 'Token is not valid' });
//   }
// };


import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // Expect "Bearer <token>"

    if (!token) return res.status(401).json({ message: 'No token provided, authorization denied' });

    // eslint-disable-next-line no-undef
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decodedData?.id; 
    next();
  } catch (error) {
    console.error('Authorization error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};


export const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // eslint-disable-next-line no-undef
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user; // Attach user to the request
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token', error });
  }
};