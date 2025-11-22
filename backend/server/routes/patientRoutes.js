// backend/routes/patientRoutes.js
const express = require("express");
const router = express.Router();
const { getPatients, getPatientProfile, updatePatientProfile } = require("../controllers/patientController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

// Protected routes
router.get("/", protect, restrictTo('doctor', 'admin'), getPatients); // Only doctors and admins can view patient lists
router.get("/profile", protect, restrictTo('patient'), getPatientProfile); // Patients can view their own profile
router.put("/profile", protect, restrictTo('patient'), updatePatientProfile); // Patients can update their own profile

module.exports = router;