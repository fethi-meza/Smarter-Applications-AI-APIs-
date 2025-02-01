// Router: authRouter.js
const route = require('express').Router();
const authController = require('../Controller/authController');  // Correct import of authController
const { registerValidationRules, loginValidationRules } = require('../utils/validation');

// Register route
route.post('/register', registerValidationRules(), authController.register);  // Make sure register is available

module.exports = route;
