const { body } = require('express-validator');
const user = require('../models/UserModel');

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

module.exports = { registerValidationRules, loginValidationRules };
