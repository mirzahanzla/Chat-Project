import Query from '../models/query.js';
import jwt from 'jsonwebtoken';

export const createQuery = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token is missing or invalid' });
  }

  const token = authHeader.split(' ')[1];
  let userID;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    userID = decoded.id;
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }

  const { contractID, reason, remarks } = req.body;

  if (!contractID) {
    return res.status(400).json({ message: 'Either contractID or postID must be provided, but not both.' });
  }

  const newQuery = new Query({
    reason,
    contractID: contractID || undefined,
    remarks,
    reporterID: userID,
  });

  try {
    await newQuery.save();
    res.status(201).json({ message: 'Query created successfully', query: newQuery });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
