const User = require('../models/user'); // ensure correct path/casing
const jwt = require('jsonwebtoken');
const Patient = require('../models/patient');
const Doctor = require('../models/doctor');

// ✅ Utility: generate JWT
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

// ✅ Register a new user
const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Create new user
        const newUser = new User({ name, email, password, role });
        await newUser.save();

        // Create profile based on role
        if (role === 'patient') {
            await Patient.create({ user: newUser._id, name: newUser.name });
        } else if (role === 'doctor') {
            await Doctor.create({ user: newUser._id, specialty: 'General' });
        }

        // Generate token
        const token = generateToken(newUser);

        // Return safe user object (exclude password)
        const safeUser = {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role
        };

        res.status(201).json({
            message: 'User registered successfully',
            user: safeUser,
            token
        });
    } catch (error) {
        next(error);
    }
};

// ✅ Login user
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate token
        const token = generateToken(user);

        const safeUser = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        res.status(200).json({
            message: 'Login successful',
            user: safeUser,
            token
        });
    } catch (error) {
        next(error);
    }
};

// ✅ Refresh JWT token
const refreshToken = async (req, res, next) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ message: 'Token required' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const newToken = generateToken(user);
            res.status(200).json({ message: 'Token refreshed', token: newToken });
        } catch (err) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
    } catch (error) {
        next(error);
    }
};

module.exports = { registerUser, loginUser, refreshToken };