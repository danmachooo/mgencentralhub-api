import { chatbotHandler } from "@/features/Chatbot/chatbot.controller";
import { requireRole } from "@/middlewares";
import { Router } from "express";


const router = Router();

router.use(requireRole("ADMIN", "EMPLOYEE"))

router.post("/ask", chatbotHandler)

export default router