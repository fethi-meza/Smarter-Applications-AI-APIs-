const beycrpt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/UserModel');

// Register a new user

const register = async (req, res) => {
    try {
       
        // Check if there are any validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success : false ,errors: errors.array() });
        }
    
        const { name, email, mobile , password } = req.body;
        
        //hash password
        const bycryptSalt = await beycrpt.genSalt(10);
        const hashedPassword = await beycrpt.hash(password, bycryptSalt);

        // Create a new user

        const newUser = new User({ name, email, password: hashedPassword, mobile });
        await newUser.save();
        return res.status(201).json({success : true , message: 'User registered successfully!', user: newUser });
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ error: 'Registration failed' });
    }
};

module.exports = { register };