const express = require('express');
const router = express.Router();
const MediBridge = require('../models/mediBridge');
const { validateMediBridgeUser } = require('../middleware/validator');

// ✅ MediBridge user management routes

// Create a new MediBridge user
// POST /api/mediBridge
router.post('/', validateMediBridgeUser, async (req, res, next) => {
    const { name, url, apiKey } = req.body;
    try {
        const newUser = new MediBridge({ name, url, apiKey });
        await newUser.save();
        res.status(201).json({ message: 'MediBridge user created successfully', user: newUser });
    } catch (error) {
        next(error); // bubble up to errorHandler
    }
});

// Get all MediBridge users
// GET /api/mediBridge
router.get('/', async (req, res, next) => {
    try {
        const users = await MediBridge.find();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
});

// Get a MediBridge user by ID
// GET /api/mediBridge/:id
router.get('/:id', async (req, res, next) => {
    try {
        const user = await MediBridge.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
});

// Update a MediBridge user by ID
// PUT /api/mediBridge/:id
router.put('/:id', validateMediBridgeUser, async (req, res, next) => {
    const { name, url, apiKey } = req.body;
    try {
        const user = await MediBridge.findByIdAndUpdate(
            req.params.id,
            { name, url, apiKey },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        next(error);
    }
});

// Delete a MediBridge user by ID
// DELETE /api/mediBridge/:id
router.delete('/:id', async (req, res, next) => {
    try {
        const user = await MediBridge.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;