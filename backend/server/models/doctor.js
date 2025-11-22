const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    specialty: { type: String, required: true, trim: true },
    bio: { type: String, trim: true },
    profileImage: { type: String },
    availableSlots: [
        { start: Date, end: Date, isBooked: { type: Boolean, default: false } }
    ],
    ratings: [
        {
            patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            score: { type: Number, min: 1, max: 5 },
            comment: { type: String, trim: true },
            createdAt: { type: Date, default: Date.now }
        }
    ],
    appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }],
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

doctorSchema.virtual('averageRating').get(function () {
    if (!this.ratings || this.ratings.length === 0) return 0;
    const sum = this.ratings.reduce((acc, r) => acc + r.score, 0);
    return (sum / this.ratings.length).toFixed(1);
});

doctorSchema.set('toJSON', { virtuals: true });
doctorSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Doctor', doctorSchema);