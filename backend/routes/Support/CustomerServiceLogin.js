import express from 'express';
import jwt from 'jsonwebtoken';
import CustomerService from './models/customerService.js';
import bcrypt from 'bcrypt';

const router = express.Router();
const JWT_SECRET = 'your_jwt_secret_key'; // Replace with a strong secret key

// Login route
router.post('/', async (req, res) => {
    const { username, password } = req.body;

    try {
        const customerService = await CustomerService.findOne({ username });
        if (!customerService) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Compare passwords
        const isMatch = await customerService.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: customerService._id, role: 'CustomerService' },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
