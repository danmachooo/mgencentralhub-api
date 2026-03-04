import { chatbotHandler } from "@/features/chatbot/chatbot.controller"
import { rateLimit, requireRole } from "@/middlewares"
import { Router } from "express"

const router = Router()

router.use(requireRole("ADMIN", "EMPLOYEE"))

router.post(
	"/ask",
	rateLimit({
		windowMs: 60 * 1000,
		max: 20,
		message: "Too many chatbot requests. Please try again in a minute.",
		keyPrefix: "chatbot:ask",
		identity: "user_and_ip",
		blockDurationMs: 5 * 60 * 1000,
	}),
	chatbotHandler
)

export default router
