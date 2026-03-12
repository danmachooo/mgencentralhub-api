import { employeeAssistant } from "@/features/chatbot/chat.orchestrator"
import { sendResponse } from "@/helpers/shared/send-response.helper"
import { asyncHandler } from "@/middlewares"
import { promptSchema, userIdentifierSchema } from "@/schema"
import type { HttpContext } from "@/types/shared"

export const chatbotHandler = asyncHandler(async (http: HttpContext) => {
	const prompt = promptSchema.parse(http.req.body)
	const user = userIdentifierSchema.parse(http.req.user)

	const response = await employeeAssistant(user, prompt)

	return sendResponse(http.res, true, 200, "Chat response generated.", response)
})
