import express from "express";
import { protectRoute } from "../middlware/auth.middleware.js";
import { messageController } from "../controller/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, messageController.getUserForSidebar);

router.get("/:id", protectRoute, messageController.getMessages);

router.post("/send/:id", protectRoute, messageController.sendMessage);

export default router;
