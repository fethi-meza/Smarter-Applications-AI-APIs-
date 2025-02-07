const chatBot = require("../models/chatbotModel");
const { validationResult } = require("express-validator");


//getChatBot
const getChatBot = async (req, res) => {
    try {
        const chatBots = await chatBot.find();

        return res.status(200).json({ success: true, chatBots });
    } catch (err) {
        console.error("Error fetching chatBots:", err);
        return res.status(500).json({ error: "Error fetching chatBots" });
    }
};

//getChatBotById
const getChatBotById = async (req, res) => {
    try {
        const chatBotId = req.params.id;
        const chatBotData = await chatBot.findById(chatBotId);

        if (!chatBotData) {
            return res.status(404).json({ success: false, message: "ChatBot not found" });
        }

        return res.status(200).json({ success: true, chatBot: chatBotData });
        } catch (err) {
        console.error("Error fetching chatBot by ID:", err);
        return res.status(500).json({ error: "Error fetching chatBot by ID" });
        }
    };

  //addchatBot : is used to add the chatBot details      
const addChatBot = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { name, message, prompt_message, status } = req.body;
        const image = req.file ? req.file.filename : ""; // Get the uploaded image filename from Multer

        // If image is missing, return an error
        if (!image) {
            return res
                .status(400)
                .json({ success: false, message: "Image is required" });
        }

        // Create a new chatBot instance with the required fields
        const newChatBot = new chatBot({
            name,
            message,
            prompt_message,
            status, // '1' for active, '0' for inactive
            image,
        });

        await newChatBot.save();

        return res.status(201).json({
            success: true,
            message: "ChatBot added successfully!",
            chatBot: {
                id: newChatBot._id,
                name: newChatBot.name,
                message: newChatBot.message,
                prompt_message: newChatBot.prompt_message,
                status: newChatBot.status,
                image: newChatBot.image,
                createdAt: newChatBot.createdAt,
                updatedAt: newChatBot.updatedAt,
            },
        });
    } catch (err) {
        console.error("Error during registration:", err);
        return res.status(500).json({ error: "Registration failed" });
    }
};



//updateChatBot : is used to update the chatBot details
const updateChatBot = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const chatBotId = req.params.id;
        const { name, message, prompt_message, status } = req.body;
        const image = req.file ? req.file.filename : "";

        const updatedChatBot = await chatBot.findByIdAndUpdate(
            chatBotId,
            {
                name,
                message,
                prompt_message,
                status,
                ...(image && { image }),
            },
            { new: true }
        );

        if (!updatedChatBot) {
            return res
                .status(404)
                .json({ success: false, message: "ChatBot not found" });
        }

        return res.status(200).json({
            success: true,
            message: "ChatBot updated successfully!",
            chatBot: {
                id: updatedChatBot._id,
                name: updatedChatBot.name,
                message: updatedChatBot.message,
                prompt_message: updatedChatBot.prompt_message,
                status: updatedChatBot.status,
                image: updatedChatBot.image,
                createdAt: updatedChatBot.createdAt,
                updatedAt: updatedChatBot.updatedAt,
            },
        });
    } catch (err) {
        console.error("Error updating chatBot:", err);
        return res.status(500).json({ error: "Error updating chatBot" });
    }
};

//deleteChatBot : is used to delete the chatBot
const deleteChatBot = async (req, res) => {
    try {
        const chatBotId = req.params.id;

        const chatBotToDelete = await chatBot.findById(chatBotId);

        if (!chatBotToDelete) {
            return res
                .status(404)
                .json({ success: false, message: "ChatBot not found" });
        }
        await chatBotToDelete.deleteOne();

        return res
            .status(200)
            .json({ success: true, message: "ChatBot deleted successfully" });
    } catch (err) {
        console.error("Error deleting chatBot:", err);
        return res.status(500).json({ error: "Error deleting chatBot" });
    }
};

module.exports = { addChatBot, getChatBot, deleteChatBot, updateChatBot , getChatBotById };
