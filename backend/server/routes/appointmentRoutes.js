// backend/server/routes/appointmentRoutes.js

const express = require('express');
const router = express.Router();
const {
    createAppointment,
    getAppointmentById,
    getAppointments,
    updateAppointment,
    deleteAppointment
} = require('../controllers/appointmentController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// ✅ Appointment management routescd 

// Create new appointment (patients only)
router.post('/', protect, restrictTo('patient'), createAppointment);

// Get all appointments (supports filtering & pagination)
router.get('/', protect, getAppointments);

// Get single appointment by ID
router.get('/:id', protect, getAppointmentById);

// Update appointment (doctors only)
router.put('/:id', protect, restrictTo('doctor'), updateAppointment);

// Delete appointment (admins or creator)
router.delete('/:id', protect, deleteAppointment);

module.exports = router;