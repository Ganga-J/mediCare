// backend/controllers/patientController.js
const Patient = require("../models/patient");
const Appointment = require("../models/appointment");
const Doctor = require("../models/doctor");

// GET /api/patients
// Return all patients linked to the logged-in user (doctor or admin)
const getPatients = async (req, res, next) => {
    try {
        let query = {};

        if (req.user.role === 'doctor') {
            // Find doctor profile
            const doctor = await Doctor.findOne({ user: req.user._id });
            if (!doctor) {
                return res.status(404).json({ message: 'Doctor profile not found' });
            }
            // Find patients with appointments to this doctor
            const appointments = await Appointment.find({ doctor: doctor._id }).distinct('patient');
            query._id = { $in: appointments };
        } else if (req.user.role === 'admin') {
            // Admins see all patients
        } else {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const patients = await Patient.find(query)
            .populate("user", "email")
            .select("name phone condition")
            .sort({ name: 1 });

        res.status(200).json(patients);
    } catch (err) {
        next(err);
    }
};

// GET /api/patients/profile
// Get current patient's profile
const getPatientProfile = async (req, res, next) => {
    try {
        const patient = await Patient.findOne({ user: req.user._id })
            .populate("user", "email")
            .select("-createdBy");

        if (!patient) {
            return res.status(404).json({ message: 'Patient profile not found' });
        }

        res.status(200).json(patient);
    } catch (err) {
        next(err);
    }
};

// PUT /api/patients/profile
// Update current patient's profile
const updatePatientProfile = async (req, res, next) => {
    try {
        const updates = req.body;
        const allowedUpdates = [
            'age', 'gender', 'address', 'phone', 'emergencyContact',
            'medicalHistory', 'allergies', 'currentMedications', 'bloodType', 'condition'
        ];

        const filteredUpdates = {};
        Object.keys(updates).forEach(key => {
            if (allowedUpdates.includes(key)) {
                filteredUpdates[key] = updates[key];
            }
        });

        filteredUpdates.updatedAt = Date.now();

        const patient = await Patient.findOneAndUpdate(
            { user: req.user._id },
            filteredUpdates,
            { new: true, runValidators: true }
        ).populate("user", "email");

        if (!patient) {
            return res.status(404).json({ message: 'Patient profile not found' });
        }

        res.status(200).json(patient);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getPatients,
    getPatientProfile,
    updatePatientProfile,
};