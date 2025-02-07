const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        conversation_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        chat_bot_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "ChatBot",
        },
        user_message: {
            type: String,
            required: true,
        },

        ai_message: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

module.exports = mongoose.model("Chat", chatSchema);
