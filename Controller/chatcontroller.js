const OpenAI = require("openai");
require("dotenv").config();

const { validationResult } = require("express-validator");
const { isConversation, creatConversation, updatConversation, creatChat, updatchat } = require("../utils/helper");

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY,
});

const SendMessage = async (req, res) => {
  try {
    // Validate incoming request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { chat_bot_id, message, conversation_id } = req.body;
    const user_id = req.user._id;
    let C_conversation_id = null;

    // Check if conversation_id exists, if not create a new conversation
    if (conversation_id) {
      const isConversationExists = await isConversation(conversation_id);
      if (!isConversationExists) {
        return res.status(201).json({
          success: false,
          message: "conversation_id doesn't exist! Ops !!"
        });
      }
      C_conversation_id = conversation_id;
      await updatConversation(C_conversation_id, message);
    } else {
      // Create a new conversation if no conversation_id exists
      C_conversation_id = await creatConversation(chat_bot_id, user_id, message);
    }

    // Prepare AI response message
    const ai_message = "Hello, how can I help you?";  

    // Create a new chat in the database
    const chat_id = await creatChat({
      user_id,
      chat_bot_id, 
      conversation_id: C_conversation_id, 
      user_message: message, 
      ai_message: ai_message
    });

    // Update the chat with AI response
    await updatchat(chat_id, ai_message);

    // Update the conversation with AI response
    await updatConversation(C_conversation_id, ai_message);

    
    return res.status(201).json({
      success: true,
      message: "Message sent successfully!",
      C_conversation_id: C_conversation_id,
      data: ai_message,
    });





    // Request AI completion using OpenRouter API
    // const completion = await openai.chat.completions.create({
    //   model: 'gpt-3.5-turbo',  // The model to use for AI completion
    //   messages: [
    //     {
    //       role: 'user',
    //       content: message,  // The message sent by the user
    //     },
    //   ],
    // });

    // If AI responds successfully, return AI's response to the user
    // if (completion.choices && completion.choices.length > 0) {
    //   return res.status(200).json({
    //     success: true,
    //     message: "AI response successfully!",
    //     data: completion.choices[0].message.content, 
    //     C_conversation_id: C_conversation_id
    //   });
    // }

     // If AI did not respond correctly, return an error
    // return res.status(500).json({
    //   error: "No response from AI model. Please try again later.",
    //});

  } catch (err) {
    // Handle rate limit error (429)
    if (err.status === 429) {
      const retryAfter = err.headers['retry-after'] || 60;
      return res.status(429).json({
        error: `Rate limit exceeded. Please try again after ${retryAfter} seconds.`,
      });
    }

    // Generic error handling
    console.error("Error during registration:", err.message);
    return res.status(500).json({ error: "AI response failed" });
  }
};

module.exports = { SendMessage };
