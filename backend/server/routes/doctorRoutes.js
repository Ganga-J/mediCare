// backend/routes/doctorRoutes.js
const express = require("express");
const router = express.Router();
const { getDoctors } = require("../controllers/doctorControllers");
const { protect } = require("../middleware/authMiddleware");

// Protected route: only logged-in users can view doctors
router.get("/", protect, getDoctors);

module.exports = router;