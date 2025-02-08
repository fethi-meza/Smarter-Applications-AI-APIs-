const OpenAI = require('openai');
const dotenv = require('dotenv').config();

// Initialize OpenAI API
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',  // Base URL for OpenRouter API 
  apiKey: process.env.OPENAI_API_KEY,  // API key for OpenAI
});

async function SendMessage(req, res) {
  try {
    const { message } = req.body;

    // Validate the message
    if (!message) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    // Requesting AI completion using OpenRouter API
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',  // The model to use for AI completion
      messages: [
        {
          role: 'user',
          content: message,  // The message sent by the user
        },
      ],
    });

    // Return the AI response to the user :  If the response is not empty and has choices available  
    if (completion.choices && completion.choices.length > 0) {
      return res.status(201).json({
        success: true,
        message: "AI response successfully!",
        data: completion.choices[0].message.content, 
      });
    } else {
      // Handle the case where the response is empty
      return res.status(500).json({
        error: "No response from AI model. Please try again later.",
      });
    }

  } catch (err) {
    // Handling rate limit error (429)
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
}

module.exports = { SendMessage };
