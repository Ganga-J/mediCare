// backend/server.js
const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/dbConnect");
const jwt = require("jsonwebtoken");
const User = require("./models/user");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));
app.use("/api/doctors", require("./routes/doctorRoutes"));
app.use("/api/patients", require("./routes/patientRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));

// Error handling middleware
app.use(require("./middleware/errorHandler"));

const server = http.createServer(app);

// Track online users
const onlineUsers = new Map(); // userId -> socketId

// ✅ Socket.IO setup directly here
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173", // frontend URL
        methods: ["GET", "POST"],
        credentials: true,
    },
});

// Middleware: authenticate socket connection with JWT
io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        if (!token) return next(new Error("No token provided"));

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("name email");
        if (!user) return next(new Error("User not found"));

        socket.user = user;
        next();
    } catch (err) {
        next(new Error("Authentication error"));
    }
});

io.on("connection", (socket) => {
    console.log(`✅ Socket connected: ${socket.user.name}`);

    // Add to online users
    onlineUsers.set(socket.user.id, socket.id);

    // Emit online doctors to all patients
    const onlineDoctorIds = Array.from(onlineUsers.keys()).filter(id => {
        // Assuming we can check role, but since socket.user has id, need to fetch role
        // For simplicity, emit all online users, and frontend filters
        return true; // TODO: filter doctors
    });
    io.emit("online users", onlineDoctorIds);

    // Join rooms for each chat
    socket.on("join chat", (chatId) => {
        socket.join(chatId);
        console.log(`${socket.user.name} joined chat ${chatId}`);
    });

    // Handle new messages
    socket.on("new message", (message) => {
        const chatId = message.chat;
        if (!chatId) return;
        io.to(chatId).emit("message received", message);
    });

    socket.on("disconnect", () => {
        console.log(`❌ Socket disconnected: ${socket.user.name}`);
        onlineUsers.delete(socket.user.id);
        // Emit updated online users
        const onlineDoctorIds = Array.from(onlineUsers.keys());
        io.emit("online users", onlineDoctorIds);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server runnin