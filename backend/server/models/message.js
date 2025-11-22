// backend/models/message.js
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        chat: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat",
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
        attachments: [
            {
                fileUrl: { type: String },
                fileType: { type: String }, // e.g. "image", "pdf", "doc"
            },
        ],
        isRead: {
            type: Boolean,
            default: false,
        },
        readAt: {
            type: Date,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Indexes for faster queries
messageSchema.index({ sender: 1, receiver: 1, timestamp: -1 });
messageSchema.index({ chat: 1, timestamp: -1 });

// Virtual field: short preview of content
messageSchema.virtual("preview").get(function () {
    return this.content.length > 30
        ? this.content.substring(0, 30) + "..."
        : this.content;
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;