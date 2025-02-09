const mongoose = require("mongoose");
const conversationSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        chatBot_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "chatBot",
            required: true,
        },
        last_message: {
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
module.exports = mongoose.model("conversation", conversationSchema);
