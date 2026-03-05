import { saveMessage } from "@/features/chatbot/chatbot.repo"
import { PrismaErrorHandler } from "@/helpers/prisma"
import { classifyIntent } from "@/features/chatbot/services/intent.service"
import { handlePublicInfo, handleDepartmentSystems, handlePersonalSystems, handleStatusReport, handleUnknownIntent } from "@/features/chatbot/services/chat.service"
import type {  PromptInput, UserIdentifier } from "@/schema"
import type { RequestLabels } from "@/features/chatbot/services/intent.service"


const employeeAssistantErrors = new PrismaErrorHandler({
	entity: "Chatbot",
})

export async function employeeAssistant(user: UserIdentifier, prompt: PromptInput) {
	await employeeAssistantErrors.exec(() => saveMessage(user, prompt, "user"))

	const intent: RequestLabels = await classifyIntent(prompt)

	let responseText = ""

	switch (intent) {
		case "PUBLIC_INFO":
			responseText = await handlePublicInfo(user, prompt)
			break
		case "DEPARTMENT_SYSTEM":
			responseText = await handleDepartmentSystems(user, prompt)
			break
		case "PERSONAL_SYSTEM":
			responseText = await handlePersonalSystems(user, prompt)
			break
		case "STATUS_REPORT":
			responseText = await handleStatusReport(user, prompt)
			break
		case "UNKNOWN":
			responseText = await handleUnknownIntent(user, prompt)
			break
		case "EVENT":
			responseText = "Event intent is currently not supported by this assistant."
			break
	}

	await employeeAssistantErrors.exec(() => saveMessage(user, { message: responseText }, "assistant"))

	return responseText
}