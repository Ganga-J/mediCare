// backend/controllers/appointmentController.js
const Appointment = require("../models/appointment");
const Doctor = require("../models/doctor");
const Patient = require("../models/patient");

// GET /api/appointments
// Return all appointments for the logged-in user based on role
const getAppointments = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const userRole = req.user.role;
        let query = {};

        if (userRole === 'patient') {
            const patient = await Patient.findOne({ user: userId });
            if (patient) {
                query.patient = patient._id;
            } else {
                return res.status(404).json({ message: 'Patient profile not found' });
            }
        } else if (userRole === 'doctor') {
            const doctor = await Doctor.findOne({ user: userId });
            if (doctor) {
                query.doctor = doctor._id;
            } else {
                return res.status(404).json({ message: 'Doctor profile not found' });
            }
        } else if (userRole === 'admin') {
            // Admins see all
        } else {
            return res.status(403).json({ message: 'Unauthorized role' });
        }

        const appointments = await Appointment.find(query)
            .populate("doctor.user", "name")
            .populate("doctor", "specialty")
            .populate("patient", "name age gender phone emergencyContact medicalHistory allergies currentMedications bloodType condition")
            .sort({ appointmentDate: 1 });

        res.status(200).json(appointments);
    } catch (err) {
        next(err);
    }
};

// POST /api/appointments
// Create new appointment (patients only)
const createAppointment = async (req, res, next) => {
    try {
        const { doctorId, appointmentDate, reason } = req.body;
        const userId = req.user._id;

        const patient = await Patient.findOne({ user: userId });
        if (!patient) {
            return res.status(404).json({ message: 'Patient profile not found' });
        }

        const newAppointment = new Appointment({
            patient: patient._id,
            doctor: doctorId,
            appointmentDate,
            reason,
            createdBy: userId
        });

        await newAppointment.save();
        await newAppointment.populate("doctor.user", "name").populate("doctor", "specialty");

        res.status(201).json(newAppointment);
    } catch (err) {
        next(err);
    }
};

// GET /api/appointments/:id
// Get single appointment by ID
const getAppointmentById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const userRole = req.user.role;

        const appointment = await Appointment.findById(id)
            .populate("doctor.user", "name")
            .populate("doctor", "specialty");

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Check access
        let hasAccess = false;
        if (userRole === 'admin') {
            hasAccess = true;
        } else if (userRole === 'patient') {
            const patient = await Patient.findOne({ user: userId });
            if (patient && appointment.patient.equals(patient._id)) {
                hasAccess = true;
            }
        } else if (userRole === 'doctor') {
            const doctor = await Doctor.findOne({ user: userId });
            if (doctor && appointment.doctor.equals(doctor._id)) {
                hasAccess = true;
            }
        }

        if (!hasAccess) {
            return res.status(403).json({ message: 'Not authorized to view this appointment' });
        }

        res.status(200).json(appointment);
    } catch (err) {
        next(err);
    }
};

// PUT /api/appointments/:id
// Update appointment (doctors only)
const updateAppointment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const userId = req.user._id;
        const userRole = req.user.role;

        if (userRole !== 'doctor' && userRole !== 'admin') {
            return res.status(403).json({ message: 'Only doctors can update appointments' });
        }

        const appointment = await Appointment.findById(id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Check if doctor is assigned
        if (userRole === 'doctor') {
            const doctor = await Doctor.findOne({ user: userId });
            if (!doctor || !appointment.doctor.equals(doctor._id)) {
                return res.status(403).json({ message: 'Not authorized to update this appointment' });
            }
        }

        Object.assign(appointment, updates, { updatedBy: userId });
        await appointment.save();
        await appointment.populate("doctor.user", "name").populate("doctor", "specialty");

        res.status(200).json(appointment);
    } catch (err) {
        next(err);
    }
};

// DELETE /api/appointments/:id
// Delete appointment (admins or creator)
const deleteAppointment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const userRole = req.user.role;

        const appointment = await Appointment.findById(id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        let canDelete = false;
        if (userRole === 'admin') {
            canDelete = true;
        } else if (appointment.createdBy && appointment.createdBy.equals(userId)) {
            canDelete = true;
        }

        if (!canDelete) {
            return res.status(403).json({ message: 'Not authorized to delete this appointment' });
        }

        await Appointment.findByIdAndDelete(id);
        res.status(200).json({ message: 'Appointment deleted' });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAppointments,
    createAppointment,
    getAppointmentById,
    updateAppointment,
    deleteAppointment,
};