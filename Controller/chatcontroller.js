const { model } = require("mongoose");
const Chat = require("../models/ChatModel");
const { OpenAI } = require("openai");

// Create a new instance of the OpenAI class
const openai = new OpenAI(process.env.OPENAI_API_KEY);

const SendMessage = async (req, res) => {
  try {
    const { message } = req.body;

   const response =  await openai.chat
      .create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "user", content: message },
        ],
        })

    return res.status(201).json({
      success: true,
      message: "AI response  successfully!",
      data: response
    });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ error: "AI response failed" });
  }
};

module.exports = { SendMessage };
