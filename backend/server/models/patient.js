const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    name: { type: String, required: true },
    age: { type: Number },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    address: { type: String },
    phone: { type: String },
    emergencyContact: {
        name: { type: String },
        phone: { type: String },
        relationship: { type: String }
    },
    medicalHistory: [{ type: String }],
    allergies: [{ type: String }],
    currentMedications: [{ type: String }],
    bloodType: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
    condition: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Patient', patientSchema);