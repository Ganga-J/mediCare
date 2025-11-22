const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');

// ✅ Helper: Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
router.post(
    '/register',
    asyncHandler(async (req, res) => {
        const { name, email, password, role } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user
        const user = await User.create({ name, email, password, role });
        if (user) {
            res.status(201).json({
                message: 'User registered successfully',
                user,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    })
);

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post(
    '/login',
    asyncHandler(async (req, res) => {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            user.lastLogin = Date.now();
            await user.save();

            res.json({
                message: 'Login successful',
                user,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    })
);

// @desc    Refresh JWT token
// @route   POST /api/auth/refresh
// @access  Public
router.post(
    '/refresh',
    asyncHandler(async (req, res) => {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ message: 'Token required' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const newToken = generateToken(decoded.id);
            res.json({ token: newToken });
        } catch (error) {
            res.status(401).json({ message: 'Invalid or expired token' });
        }
    })
);

module.exports = router;