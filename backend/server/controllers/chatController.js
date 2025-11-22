// backend/controllers/chatController.js
const Chat = require("../models/chat");
const Message = require("../models/message");
const Doctor = require("../models/doctor");
const Patient = require("../models/patient");

// POST /api/chat
// Create a new chat between patient and doctor
const createChat = async (req, res, next) => {
    try {
        const { doctorId, patientId } = req.body;
        const userId = req.user._id;
        const userRole = req.user.role;

        let participants = [];
        let chatType = 'doctor-patient';

        if (userRole === 'patient') {
            // Patient starting chat with doctor
            if (!doctorId) {
                return res.status(400).json({ message: 'Doctor ID required' });
            }
            const doctor = await Doctor.findOne({ user: doctorId });
            if (!doctor) {
                return res.status(404).json({ message: 'Doctor not found' });
            }
            const patient = await Patient.findOne({ user: userId });
            if (!patient) {
                return res.status(404).json({ message: 'Patient profile not found' });
            }
            participants = [userId, doctorId];
        } else if (userRole === 'doctor') {
            // Doctor starting chat with patient
            if (!patientId) {
                return res.status(400).json({ message: 'Patient ID required' });
            }
            const patient = await Patient.findOne({ user: patientId });
            if (!patient) {
                return res.status(404).json({ message: 'Patient not found' });
            }
            const doctor = await Doctor.findOne({ user: userId });
            if (!doctor) {
                return res.status(404).json({ message: 'Doctor profile not found' });
            }
            participants = [userId, patientId];
        } else {
            return res.status(403).json({ message: 'Unauthorized to create chat' });
        }

        // Check if chat already exists
        const existingChat = await Chat.findOne({
            participants: { $all: participants }
        });

        if (existingChat) {
            return res.status(200).json(existingChat);
        }

        // Create new chat
        const newChat = new Chat({
            participants,
            chatType
        });

        await newChat.save();
        await newChat.populate("participants", "name email");

        res.status(201).json(newChat);
    } catch (err) {
        next(err);
    }
};

// GET /api/chat
// Return all chats for the logged-in user with lastMessage populated
const getUserChats = async (req, res, next) => {
    try {
        const chats = await Chat.find({ participants: req.user._id })
            .populate("participants", "name email")
            .populate({
                path: "lastMessage",
                populate: { path: "sender", select: "name email" },
            })
            .sort({ updatedAt: -1 });

        res.status(200).json(chats);
    } catch (err) {
        next(err);
    }
};

// GET /api/chat/:chatId/messages
// Return all messages for a specific chat
const getChatMessages = async (req, res, next) => {
    try {
        const { chatId } = req.params;

        const chat = await Chat.findById(chatId).populate("participants", "name email");
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }
        if (!chat.participants.some((p) => p._id.equals(req.user._id))) {
            return res.status(403).json({ message: "Not authorized to view this chat" });
        }

        const messages = await Message.find({ chat: chatId })
            .populate("sender", "name email")
            .populate("receiver", "name email")
            .sort({ timestamp: 1 });

        res.status(200).json(messages);
    } catch (err) {
        next(err);
    }
};

// POST /api/chat/message
// Send a new message in a chat
const sendMessage = async (req, res, next) => {
    try {
        const { chatId, content, receiver } = req.body;

        const message = await Message.create({
            chat: chatId,
            sender: req.user._id,
            receiver,
            content,
        });

        // Update chat with lastMessage reference
        await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id });

        const populatedMessage = await Message.findById(message._id)
            .populate("sender", "name email")
            .populate("receiver", "name email");

        res.status(201).json(populatedMessage);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createChat,
    getUserChats,
    getChatMessages,
    sendMessage,
};