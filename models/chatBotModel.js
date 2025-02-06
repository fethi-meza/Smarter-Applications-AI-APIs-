const mongoose = require('mongoose');

const chatBotSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    prompt_message: {
        type: String,
        required: true,  
    },
    image: {
        type: String,
        required: true,  
    },
    status: {
        type: String, 
        enum: ['1', '0'],  // 1 = Active, 0 = Inactive
        required: true,  
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

module.exports = mongoose.model('chatBot', chatBotSchema);
