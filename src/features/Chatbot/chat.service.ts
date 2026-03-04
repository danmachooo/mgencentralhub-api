import { saveMessage } from "@/features/chatbot/chatbot.repo"
import { PrismaErrorHandler } from "@/helpers/prisma"
import { classifyIntent } from "@/features/chatbot/intent.service"
import { getRecentConversations } from "@/features/chatbot/memory.service"
import { chatWithGemini } from "@/features/chatbot/ai.service"
import { getUserAccessContext } from "@/features/Users/profile/user-profile.service"
import { getCompanySystems } from "@/features/Systems/system.service"
import { getOwnSystems } from "@/features/Systems/personal-systems/personal-system.service"
import { getActiveSystemFlags } from "@/features/Systems/system-flags/flag.service"
import { appConfig } from "@/config/app-config"
import { gemini } from "@/lib/gemini"
import type { CreatorIdentifier, PromptInput, UserIdentifier } from "@/schema"
import type { RequestLabels } from "@/features/chatbot/intent.service"

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

async function handleDepartmentSystems(user: UserIdentifier, prompt: PromptInput): Promise<string> {
	const conversation = await getRecentConversations(user)
	const profile = await getUserAccessContext(user)
	if (!profile.department) {
		throw new Error("User department is required for department system intent.")
	}

	const query = {
		page: 1,
		limit: 20,
		sortOrder: "desc" as const,
		sortBy: "createdAt" as const,
	}

	const departmentId = profile.department.id
	const departmentName = profile.department.name
	const { systems, total } = await getCompanySystems(query, departmentId)

	const departmentContext = [
		`User Department: ${departmentName}`,
		`User Department ID: ${departmentId}`,
		`Visible Department/Public Systems Count: ${total}`,
		...systems.map((system, index) => {
			const status = system.systemFlag.name
			const isPublic = system.departmentMap.length === 0
			const isVisibleToUserDepartment =
				isPublic || system.departmentMap.some(dep => dep.departmentId === departmentId)
			const visibility = isPublic
				? "PUBLIC"
				: isVisibleToUserDepartment
					? `DEPARTMENT_SCOPED (${departmentName})`
					: "NOT_FOR_YOUR_DEPARTMENT"

			return `${index + 1}. ${system.name} | url: ${system.url} | status: ${status} | visibility: ${visibility} | description: ${system.description ?? "N/A"}`
		}),
	].join("\n")

	return chatWithGemini({
		systemContext: departmentContext,
		conversation,
		userMessage: prompt.message,
	})
}

async function handlePersonalSystems(user: UserIdentifier, prompt: PromptInput): Promise<string> {
	const conversation = await getRecentConversations(user)

	const query = {
		page: 1,
		limit: 20,
		sortOrder: "desc" as const,
		sortBy: "createdAt" as const,
	}

	const creator: CreatorIdentifier = { id: user.id }
	const { systems, total } = await getOwnSystems(query, creator)

	const personalContext = [
		`Personal Systems Count: ${total}`,
		...systems.map((system, index) => {
			return `${index + 1}. ${system.name} | url: ${system.url} | description: ${system.description ?? "N/A"}`
		}),
	].join("\n")

	return chatWithGemini({
		systemContext: personalContext,
		conversation,
		userMessage: prompt.message,
	})
}
async function handlePublicInfo(user: UserIdentifier, prompt: PromptInput): Promise<string> {
	const conversation = await getRecentConversations(user)

	const contents = [
		...conversation,
		{
			role: "user",
			parts: [
				{
					text: `
You are an internal employee assistant for Microgenesis Business System.

Task:
- Answer company-related questions using publicly available information.
- Prioritize official company/public website sources for Microgenesis Business System.
- If information cannot be verified from public sources, say you don't know.
- Do not invent facts.
                    
User question:
${prompt.message}
                    `,
				},
			],
		},
	]

	const response = await gemini.models.generateContent({
		model: appConfig.gemini.model,
		contents,
		config: {
			tools: [{ googleSearch: {} }],
		},
	})

	return response.text ?? "I don't know based on the available public information."
}

async function handleStatusReport(user: UserIdentifier, prompt: PromptInput): Promise<string> {
	const conversation = await getRecentConversations(user)
	const profile = await getUserAccessContext(user)
	if (!profile.department) {
		throw new Error("User department is required for status report intent.")
	}

	const query = {
		page: 1,
		limit: 100,
		sortOrder: "desc" as const,
		sortBy: "createdAt" as const,
	}

	const departmentId = profile.department.id
	const departmentName = profile.department.name
	const [{ systems, total }, { flags }] = await Promise.all([
		getCompanySystems(query, departmentId),
		getActiveSystemFlags(),
	])

	const systemsByStatus = systems.reduce<Record<string, string[]>>((acc, system) => {
		const status = system.systemFlag.name
		acc[status] = acc[status] ?? []
		acc[status].push(system.name)
		return acc
	}, {})

	const statusContext = [
		`Status Report Scope: Visible department/public company systems`,
		`User Department: ${departmentName}`,
		`Total Visible Systems: ${total}`,
		`Available Status Flags: ${flags.map(flag => `${flag.name} (${flag.description})`).join("; ")}`,
		...Object.entries(systemsByStatus).map(
			([status, names]) => `${status}: ${names.length} system(s) -> ${names.join(", ")}`
		),
	].join("\n")

	return chatWithGemini({
		systemContext: statusContext,
		conversation,
		userMessage: prompt.message,
	})
}

async function handleUnknownIntent(user: UserIdentifier, prompt: PromptInput): Promise<string> {
	const conversation = await getRecentConversations(user)

	return chatWithGemini({
		systemContext:
			"Intent could not be classified. Ask clarifying questions and answer conservatively using only available context.",
		conversation,
		userMessage: prompt.message,
	})
}
