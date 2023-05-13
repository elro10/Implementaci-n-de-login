import { Router, json } from "express";
import ChatManager from "../dao/db-managers/chatManager.js";
const chatManagerRouter = Router();
chatManagerRouter.use(json());
const chat = new ChatManager();

chatManagerRouter.put("/", async (req,res, chatSocket) =>{
    try {
        const messages = req.body.messages;
        console.log(messages);
       chatSocket();
       res.send (enviarChats)
    } catch (error) {
        
    }
})

export default chatManagerRouter;