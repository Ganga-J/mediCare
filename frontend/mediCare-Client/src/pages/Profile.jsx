// frontend/mediCare-Client/src/pages/Profile.jsx
import { useEffect, useState } from "react";
import api from "../services/api";

function Profile() {
    const [profile, setProfile] = useState({
        name: "",
        age: "",
        gender: "",
        address: "",
        phone: "",
        emergencyContact: { name: "", phone: "", relationship: "" },
        medicalHistory: [],
        allergies: [],
        currentMedications: [],
        bloodType: "",
        condition: ""
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data } = await api.get("/patients/profile");
            setProfile({
                ...data,
                emergencyContact: data.emergencyContact || { name: "", phone: "", relationship: "" },
                medicalHistory: data.medicalHistory || [],
                allergies: data.allergies || [],
                currentMedications: data.currentMedications || []
            });
        } catch (err) {
            setError("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            const { data } = await api.put("/patients/profile", profile);
            setProfile(data);
            setSuccess("Profile updated successfully!");
        } catch (err) {
            setError("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    const handleArrayChange = (field, value) => {
        setProfile(prev => ({
            ...prev,
            [field]: value.split(',').map(item => item.trim()).filter(item => item)
        }));
    };

    const handleEmergencyContactChange = (field, value) => {
        setProfile(prev => ({
            ...prev,
            emergencyContact: {
                ...prev.emergencyContact,
                [field]: value
            }
        }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-xl text-gray-600">Loading profile...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                        👤 My Medical Profile
                    </h1>

                    {error && <p className="text-red-600 bg-red-50 p-4 rounded-lg mb-6">{error}</p>}
                    {success && <p className="text-green-600 bg-green-50 p-4 rounded-lg mb-6">{success}</p>}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Information */}
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">📋 Basic Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        value={profile.name}
                                        onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                                    <input
                                        type="number"
                                        value={profile.age || ""}
                                        onChange={(e) => setProfile(prev => ({ ...prev, age: e.target.value }))}
                                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                                    <select
                                        value={profile.gender}
                                        onChange={(e) => setProfile(prev => ({ ...prev, gender: e.target.value }))}
                                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Blood Type</label>
                                    <select
                                        value={profile.bloodType}
                                        onChange={(e) => setProfile(prev => ({ ...prev, bloodType: e.target.value }))}
                                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select Blood Type</option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">📞 Contact Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={profile.phone}
                                        onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                    <input
                                        type="text"
                                        value={profile.address}
                                        onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Emergency Contact */}
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">🚨 Emergency Contact</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                    <input
                                        type="text"
                                        value={profile.emergencyContact.name}
                                        onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
                                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                    <input
                                        type="tel"
                                        value={profile.emergencyContact.phone}
                                        onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
                                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
                                    <input
                                        type="text"
                                        value={profile.emergencyContact.relationship}
                                        onChange={(e) => handleEmergencyContactChange('relationship', e.target.value)}
                                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Medical Information */}
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">🏥 Medical Information</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Condition</label>
                                    <textarea
                                        value={profile.condition}
                                        onChange={(e) => setProfile(prev => ({ ...prev, condition: e.target.value }))}
                                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows="3"
                                        placeholder="Describe your current medical condition..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Medical History (comma-separated)</label>
                                    <input
                                        type="text"
                                        value={profile.medicalHistory.join(', ')}
                                        onChange={(e) => handleArrayChange('medicalHistory', e.target.value)}
                                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g., Diabetes, Hypertension, Surgery"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Allergies (comma-separated)</label>
                                    <input
                                        type="text"
                                        value={profile.allergies.join(', ')}
                                        onChange={(e) => handleArrayChange('allergies', e.target.value)}
                                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g., Penicillin, Nuts, Dust"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Medications (comma-separated)</label>
                                    <input
                                        type="text"
                                        value={profile.currentMedications.join(', ')}
                                        onChange={(e) => handleArrayChange('currentMedications', e.target.value)}
                                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g., Aspirin 100mg, Metformin 500mg"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-semibold shadow-md disabled:opacity-50"
                            >
                                {saving ? "💾 Saving..." : "💾 Save Profile"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Profile;