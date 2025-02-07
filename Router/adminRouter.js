const route = require("express").Router();
const adminController = require("../Controller/adminController");

const authAdmin = require("../middlewares/adminAuth");
const { addchatBotRules , deleteChatBotRules, updateChatBotRules , getChatBotByIdRules } = require("../utils/validation");

const upload = require("../utils/upload");


// Admin routes : getChatBot, addChatBot, updateChatBot, deleteChatBot

route.get("/chatBots",authAdmin,adminController.getChatBot);

route.get("/chatBot/:id",authAdmin,getChatBotByIdRules(),adminController.getChatBotById);
route.post("/Add-chatBot", authAdmin, upload, addchatBotRules(), adminController.addChatBot);
route.put("/update-chatBot/:id", authAdmin, upload, updateChatBotRules(), adminController.updateChatBot);

route.delete("/delete-chatBot/:id", authAdmin, deleteChatBotRules(), adminController.deleteChatBot);


module.exports = route;