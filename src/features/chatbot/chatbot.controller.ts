import { employeeAssistant } from "@/features/chatbot/chat.service"
import { asyncHandler } from "@/middlewares"
import { promptSchema, userIdentifierSchema } from "@/schema"
import type { HttpContext } from "@/types/shared"

export const chatbotHandler = asyncHandler(async (http: HttpContext) => {
	const prompt = promptSchema.parse(http.req.body)
	const user = userIdentifierSchema.parse({
		id: http.req.user.userId,
	})

	const response = await employeeAssistant(user, prompt)

	return http.res.status(200).json({
		success: true,
		data: response,
	})
})
