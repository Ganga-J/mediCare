// backend/controllers/doctorController.js
const Doctor = require("../models/doctor");

// GET /api/doctors
// Return all doctors in the system
const getDoctors = async (req, res, next) => {
    try {
        const doctors = await Doctor.find().populate("user", "name email").select("specialty");
        res.status(200).json(doctors);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getDoctors,
};