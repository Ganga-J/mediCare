// frontend/src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const { onlineUsers } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);
    const [showBooking, setShowBooking] = useState(false);
    const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');
    const [reason, setReason] = useState('');

    const isPatient = user.role === 'patient';
    const isDoctor = user.role === 'doctor';
    const isAdmin = user.role === 'admin';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const promises = [api.get("/appointments"), api.get("/chat")];

                if (isPatient || isAdmin) {
                    promises.push(api.get("/doctors"));
                }
                if (isDoctor || isAdmin) {
                    promises.push(api.get("/patients"));
                }

                const results = await Promise.all(promises);
                setAppointments(results[0].data);

                let index = 1;
                if (isPatient || isAdmin) {
                    setDoctors(results[index++].data);
                }
                if (isDoctor || isAdmin) {
                    setPatients(results[index++].data);
                }

                const msgRes = results[index];
                // Flatten messages from chats (show last message per chat)
                const recentMessages = msgRes.data
                    .map((chat) => chat.lastMessage)
                    .filter(Boolean);
                setMessages(recentMessages);
            } catch (err) {
                setError("Failed to load dashboard data");
                console.error(err);
            }
        };

        fetchData();
    }, [isPatient, isDoctor, isAdmin]);

    const handleStartChat = async (doctorId) => {
        try {
            const response = await api.post("/chat", { doctorId });
            // Redirect to chat page with the chat id
            window.location.href = `/chat?chatId=${response.data._id}`;
        } catch (err) {
            console.error("Failed to start chat", err);
            alert("Failed to start chat");
        }
    };

    const handleStartChatWithPatient = async (patientId) => {
        try {
            const response = await api.post("/chat", { patientId });
            // Redirect to chat page with the chat id
            window.location.href = `/chat?chatId=${response.data._id}`;
        } catch (err) {
            console.error("Failed to start chat", err);
            alert("Failed to start chat");
        }
    };

    const bookAppointment = async () => {
        if (!selectedDoctorForBooking || !appointmentDate) {
            alert("Please select a doctor and date");
            return;
        }
        try {
            await api.post("/appointments", {
                doctorId: selectedDoctorForBooking,
                appointmentDate,
                reason
            });
            alert("Appointment booked successfully!");
            setShowBooking(false);
            // Refresh appointments
            fetchData();
        } catch (err) {
            console.error("Failed to book appointment", err);
            alert("Failed to book appointment");
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-lg p-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Welcome, {user.name}</h1>
                        <p className="text-gray-600 capitalize">{user.role} Dashboard</p>
                    </div>
                    <div className="flex gap-4">
                        {isPatient && (
                            <a
                                href="/profile"
                                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 font-semibold shadow-md"
                            >
                                👤 My Profile
                            </a>
                        )}
                        <button
                            onClick={logout}
                            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 font-semibold shadow-md"
                        >
                            🚪 Logout
                        </button>
                    </div>
                </div>

                {error && <p className="text-red-600 bg-red-50 p-4 rounded-lg text-center">{error}</p>}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Appointments Section */}
                    <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
                            📅 {isDoctor ? 'My Appointments' : 'Your Appointments'}
                        </h2>
                        {appointments.length === 0 ? (
                            <p className="text-gray-500">No appointments found.</p>
                        ) : (
                            <ul className="space-y-3">
                                {appointments.map((appt) => (
                                    <li
                                        key={appt._id}
                                        className="border border-gray-200 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition duration-200"
                                    >
                                        <p className="font-medium">
                                            📆 {new Date(appt.appointmentDate).toLocaleString()}
                                        </p>
                                        {isPatient && (
                                            <p>
                                                👨‍⚕️ <strong>Doctor:</strong>{" "}
                                                {appt.doctor?.user?.name || "N/A"} ({appt.doctor?.specialty || "N/A"})
                                            </p>
                                        )}
                                        {isDoctor && (
                                            <div>
                                                <p>
                                                    👤 <strong>Patient:</strong>{" "}
                                                    {appt.patient?.name || "N/A"}
                                                </p>
                                                {appt.patient && (
                                                    <div className="mt-2 text-sm text-gray-600">
                                                        <p>📞 Phone: {appt.patient.phone}</p>
                                                        <p>🎂 Age: {appt.patient.age}</p>
                                                        <p>⚕️ Condition: {appt.patient.condition || 'Not specified'}</p>
                                                        {appt.patient.allergies?.length > 0 && (
                                                            <p>🚫 Allergies: {appt.patient.allergies.join(', ')}</p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <p className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${
                                            appt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                            appt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {appt.status}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Appointment Booking Section - for patients */}
                    {isPatient && (
                        <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
                            <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center justify-between">
                                📅 Book Appointment
                                <button
                                    onClick={() => setShowBooking(!showBooking)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                                >
                                    {showBooking ? 'Cancel' : 'Book Now'}
                                </button>
                            </h2>
                            {showBooking && (
                                <div className="space-y-4">
                                    <select
                                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={selectedDoctorForBooking}
                                        onChange={(e) => setSelectedDoctorForBooking(e.target.value)}
                                        required
                                    >
                                        <option value="">Select Doctor</option>
                                        {doctors.map((doc) => (
                                            <option key={doc._id} value={doc.user._id}>
                                                {doc.user?.name} - {doc.specialty}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="datetime-local"
                                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={appointmentDate}
                                        onChange={(e) => setAppointmentDate(e.target.value)}
                                        required
                                    />
                                    <textarea
                                        placeholder="Reason for appointment"
                                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                    />
                                    <button
                                        onClick={bookAppointment}
                                        className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 font-semibold shadow-md"
                                    >
                                        📅 Book Appointment
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Doctors Section - for patients and admins */}
                    {(isPatient || isAdmin) && (
                        <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
                            <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
                                👨‍⚕️ Available Doctors
                            </h2>
                            {doctors.length === 0 ? (
                                <p className="text-gray-500">No doctors found.</p>
                            ) : (
                                <ul className="space-y-3">
                                    {doctors.map((doc) => (
                                        <li
                                            key={doc._id}
                                            className="border border-gray-200 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition duration-200"
                                        >
                                                <p className="font-medium flex items-center">
                                                    👤 {doc.user?.name}
                                                    {onlineUsers.includes(doc.user._id) && <span className="ml-2 w-2 h-2 bg-green-500 rounded-full"></span>}
                                                </p>
                                                <p>🏥 <strong>Specialty:</strong> {doc.specialty}</p>
                                                <p>📧 <strong>Email:</strong> {doc.user?.email}</p>
                                                <button
                                                    onClick={() => handleStartChat(doc.user._id)}
                                                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                                                >
                                                    💬 Start Chat
                                                </button>
                                            </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}

                    {/* Patients Section - for doctors and admins */}
                    {(isDoctor || isAdmin) && (
                        <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
                            <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
                                👥 My Patients
                            </h2>
                            {patients.length === 0 ? (
                                <p className="text-gray-500">No patients found.</p>
                            ) : (
                                <ul className="space-y-3">
                                    {patients.map((pat) => (
                                        <li
                                            key={pat._id}
                                            className="border border-gray-200 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition duration-200"
                                        >
                                            <p className="font-medium">👤 {pat.name}</p>
                                            <p>📧 <strong>Email:</strong> {pat.user?.email}</p>
                                            <p>📞 <strong>Phone:</strong> {pat.phone}</p>
                                            <p>🏥 <strong>Condition:</strong> {pat.condition || 'Not specified'}</p>
                                            <button
                                                onClick={() => handleStartChatWithPatient(pat.user._id)}
                                                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                                            >
                                                💬 Start Chat
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}

                    {/* Messages Section */}
                    <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl lg:col-span-2">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
                            💬 Recent Messages
                        </h2>
                        {messages.length === 0 ? (
                            <p className="text-gray-500">No messages yet.</p>
                        ) : (
                            <ul className="space-y-3">
                                {messages.slice(0, 5).map((msg) => (
                                    <li
                                        key={msg._id}
                                        className="border border-gray-200 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition duration-200"
                                    >
                                        <p className="font-medium">👤 <strong>From:</strong> {msg.sender?.name || "Unknown"}</p>
                                        <p className="text-gray-700">{msg.content.length > 50 ? msg.content.substring(0, 50) + "..." : msg.content}</p>
                                        <p className="text-xs text-gray-500">
                                            🕒 {new Date(msg.timestamp).toLocaleString()}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <a
                            href="/chat"
                            className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-semibold shadow-md"
                        >
                            💬 Go to Chat
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;