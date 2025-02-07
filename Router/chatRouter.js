
const route = require('express').Router();
const chatController = require('../Controller/chatcontroller');  
const { registerValidationRules, loginValidationRules } = require('../utils/validation');




const auth = require('../middlewares/auth');

route.post('/send-message', auth, chatController.SendMessage); 

module.exports = route; 
