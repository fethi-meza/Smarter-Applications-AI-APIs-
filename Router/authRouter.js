
const route = require('express').Router();
const authController = require('../Controller/authController');  
const { registerValidationRules, loginValidationRules } = require('../utils/validation');


const auth = require('../middlewares/auth');

// Register route
route.post('/register', registerValidationRules(), authController.register); 
route.post('/login', loginValidationRules(), authController.login); 

// Profile route
route.get('/profile', auth, authController.profile); 

module.exports = route; 
