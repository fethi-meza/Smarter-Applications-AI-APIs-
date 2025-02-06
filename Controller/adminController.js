const chatBot = require("../models/chatBotModel");
const { validationResult } = require("express-validator");

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


//getChatBot
const getChatBot = async (req, res) => {
  try {
    const chatBots = await chatBot.find();

    return res.status(200).json({ success: true, chatBots });
  } catch (err) {
    console.error("Error fetching chatBots:", err);
    return res.status(500).json({ error: "Error fetching chatBots" });
  }
}


module.exports = { addChatBot , getChatBot };
