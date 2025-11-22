const express = require('express');
const router = express.Router();
const MediBridge = require('../');
const { validateMediBridgeUser } = require('../middleware/validator');

// ✅ MediBridge user management routes

// Create a new MediBridge user
// POST /api/newUser
router.post('/', validateMediBridgeUser, async (req, res, next) => {
    try {
        const { name, url, apiKey } = req.body;
        const newUser = new MediBridge({ name, url, apiKey });
        await newUser.save();
        res.status(201).json({ message: 'MediBridge user created successfully', user: newUser });
    } catch (error) {
        next(error);
    }
});

// Get all MediBridge users
// GET /api/newUser
router.get('/', async (req, res, next) => {
    try {
        const users = await MediBridge.find();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
});

module.exports = router;