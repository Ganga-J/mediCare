const mongoose = require('mongoose');

const mediBridgeSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    url: { type: String, required: true },
    apiKey: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// ✅ Correct model name here
const MediBridge = mongoose.models.MediBridge || mongoose.model('MediBridge', mediBridgeSchema);

module.exports = MediBridge;