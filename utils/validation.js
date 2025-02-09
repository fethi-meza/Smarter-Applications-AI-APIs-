const { body, param } = require('express-validator');
const user = require('../models/UserModel');
const { get } = require('mongoose');

// Registration Validation Rules
const registerValidationRules = () => {
    return [
        body('name')
            .not().isEmpty().withMessage('Name is required'),

        body('email')
            .isEmail().withMessage('Please enter a valid email address')
            .normalizeEmail(), // Normalize email to ensure consistency

        body('password')
            .isLength({ min: 8, max: 30 }).withMessage('Password should be 8-30 characters long')
            .matches(/^[a-zA-Z0-9]*$/).withMessage('Password should be alphanumeric')
            .custom(async (password, { req }) => {
                const existingUser = await user.findOne({ email: req.body.email });
                if (existingUser) {
                    throw new Error('User already exists');
                }
                return true;
            })
    ];
};

// Login Validation Rules
const loginValidationRules = () => {
    return [
        body('email')
            .isEmail().withMessage('Please enter a valid email address')
            .normalizeEmail(),

        body('password')
            .isLength({ min: 8, max: 30 }).withMessage('Password should be 8-30 characters long')
            .matches(/^[a-zA-Z0-9]*$/).withMessage('Password should be alphanumeric')
    ];
};


// Add ChatBot Validation Rules
const addchatBotRules = () => {
    return [
        body('name').not().isEmpty().withMessage('Name is required').trim(),
        body('message').not().isEmpty().withMessage('Message is required').trim(),
        body('prompt_message').not().isEmpty().withMessage('Prompt_message is required').trim(),
        body('status').not().isEmpty().withMessage('Status is required').isIn(['1', '0']).withMessage('Status must be 1 (active) or 0 (inactive)').trim(),

        // Ensure file is uploaded and has correct mimetype
        body('image').custom((value, { req }) => {
            if (!req.file) {
                throw new Error('Image is required');
            }
            if (req.file.mimetype !== 'image/jpeg' && req.file.mimetype !== 'image/png') {
                throw new Error('Image must be in JPEG or PNG format');
            }
            return true;
        }).withMessage('Image is required and must be a JPEG or PNG').trim()
    ];
};


const updateChatBotRules = () => {
    return [
        body('name').not().isEmpty().withMessage('Name is required').trim(),
        body('message').not().isEmpty().withMessage('Message is required').trim(),
        body('prompt_message').not().isEmpty().withMessage('Prompt_message is required').trim(),
        body('status').not().isEmpty().withMessage('Status is required').isIn(['1', '0']).withMessage('Status must be 1 (active) or 0 (inactive)').trim(),

        // Ensure file is uploaded and has correct mimetype
        body('image').custom((value, { req }) => {
            if (!req.file) {
                throw new Error('Image is required');
            }
            if (req.file.mimetype !== 'image/jpeg' && req.file.mimetype !== 'image/png') {
                throw new Error('Image must be in JPEG or PNG format');
            }
            return true;
        }).withMessage('Image is required and must be a JPEG or PNG').trim()
    ];
};

const deleteChatBotRules = () => {
    return [
        param('id').not().isEmpty().withMessage('Id is required').trim(),
    ];
}


const getChatBotByIdRules = () => {
    return [
        param('id').not().isEmpty().withMessage('Id is required').trim(),
    ];
}


const sendMessageRules = () => {
    return [
        body('chat_bot_id').not().isEmpty().withMessage('Chat_bot_id is required').trim(),
        body('message').not().isEmpty().withMessage('message is required').trim(),
    ];
};
module.exports = { registerValidationRules, loginValidationRules, addchatBotRules, deleteChatBotRules, updateChatBotRules, getChatBotByIdRules, sendMessageRules };