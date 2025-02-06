const route = require("express").Router();
const adminController = require("../Controller/adminController");

const authAdmin = require("../middlewares/adminAuth");
const { addchatBotRules } = require("../utils/validation");

const upload = require("../utils/upload");

route.post("/Add-chatBot",authAdmin,upload,addchatBotRules() ,adminController.addChatBot);
route.get("/chatBots",authAdmin,adminController.getChatBot);
module.exports = route;
