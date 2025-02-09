const Conversation = require("../models/conversationModel");
const ChatBot = require("../models/chatbotModel");
const Chat = require("../models/chatModel");

const isBotexists = async (chat_Bot_id) => {
  try {
    const chatBot = await ChatBot.findById({ _id: chat_Bot_id });
    if (!chatBot) {
      return res.status(404).json({ error: "ChatBot not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

const isConversation = async (conversation_id) => {
  try {
    const conversation = await Conversation.findById({ _id: conversation_id });
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

// Create a new conversation
const creatConversation = async (chat_bot_id, user_id, message) => {
    try {
      const conversation = await Conversation.create({
        chatBot_id: chat_bot_id,
        user_id: user_id,
        last_message: message,
      });
      
      return conversation._id;
    } catch (error) {
      console.error("Error creating conversation:", error.message);r
      throw new Error("Error creating conversation");
    }
  };
  


// Update conversation
const updatConversation = async (conversation_id, message) => {
    try {
      const updatedConversation = await Conversation.findByIdAndUpdate(
        conversation_id,
        { last_message: message },
        { new: true }
      );
      return updatedConversation;
    } catch (error) {
      console.log("Error updating conversation:", error.message);
      return null; 
    }
  };
  

  // Create a new chat
  const creatChat = async ({ user_id, chat_bot_id, conversation_id, user_message, ai_message }) => {
    try {
      const newChat = new Chat({
        user_id,
        chat_bot_id,
        conversation_id,
        user_message,
        ai_message
      });
  
      const chat = await newChat.save();
      return chat._id;
    } catch (error) {
      console.error("Error creating chat:", error.message);
      throw new Error("Error creating chat");
    }
  };
  

//update chat
  const updatchat = async (chat_id, message) => {
    try {
      const updatedChat = await Chat.findByIdAndUpdate(
        chat_id,
        { ai_message: message },
        { new: true }
      );
      return updatedChat;
    } catch (error) {
      console.log("Error updating Chat:", error.message);
      return null; 
    }
  };


module.exports = { isBotexists, isConversation, creatConversation , updatConversation , creatChat , updatchat};
