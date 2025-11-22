// backend/routes/chatRoutes.js
const express = require("express");
const router = express.Router();
const {
    createChat,
    getUserChats,
    getChatMessages,
    sendMessage,
} = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

// Protected routes
router.post("/", protect, createChat);
router.get("/", protect, getUserChats);
router.get("/:chatId/messages", protect, getChatMessages);
router.post("/message", protect, sendMessage);

module.exports = router;