import { appConfig } from "@/config/app-config"
import { ValidationError } from "@/errors"
import { gemini } from "@/lib/gemini"
import { chatWithGemini } from "@/features/chatbot/services/ai.service"
import { getRecentConversations } from "@/features/chatbot/services/memory.service"
import { getOwnSystems } from "@/features/systems/personal-systems/personal-system.service"
import { getActiveSystemFlags } from "@/features/systems/system-flags/flag.service"
import { getCompanySystems } from "@/features/systems/system.service"
import { getUserAccessContext } from "@/features/users/profile/user-profile.service"
import type { UserIdentifier, PromptInput, CreatorIdentifier } from "@/schema"

type CompanySystemsResult = Awaited<ReturnType<typeof getCompanySystems>>
type OwnSystemsResult = Awaited<ReturnType<typeof getOwnSystems>>

export async function handleDepartmentSystems(user: UserIdentifier, prompt: PromptInput): Promise<string> {
	const conversation = await getRecentConversations(user)
	const profile = await getUserAccessContext(user)
	if (!profile.department) {
		throw new ValidationError("User department is required for department system intent.")
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
		...systems.map((system: CompanySystemsResult["systems"][number], index: number) => {
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

export async function handlePersonalSystems(user: UserIdentifier, prompt: PromptInput): Promise<string> {
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
		...systems.map((system: OwnSystemsResult["systems"][number], index: number) => {
			return `${index + 1}. ${system.name} | url: ${system.url} | description: ${system.description ?? "N/A"}`
		}),
	].join("\n")

	return chatWithGemini({
		systemContext: personalContext,
		conversation,
		userMessage: prompt.message,
	})
}
export async function handlePublicInfo(user: UserIdentifier, prompt: PromptInput): Promise<string> {
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

export async function handleStatusReport(user: UserIdentifier, prompt: PromptInput): Promise<string> {
	const conversation = await getRecentConversations(user)
	const profile = await getUserAccessContext(user)
	if (!profile.department) {
		throw new ValidationError("User department is required for status report intent.")
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

	const systemsByStatus = systems.reduce<Record<string, string[]>>(
		(acc: Record<string, string[]>, system: CompanySystemsResult["systems"][number]) => {
			const status = system.systemFlag.name
			acc[status] = acc[status] ?? []
			acc[status].push(system.name)
			return acc
		},
		{}
	)

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

export async function handleUnknownIntent(user: UserIdentifier, prompt: PromptInput): Promise<string> {
	const conversation = await getRecentConversations(user)

	return chatWithGemini({
		systemContext:
			"Intent could not be classified. Ask clarifying questions and answer conservatively using only available context.",
		conversation,
		userMessage: prompt.message,
	})
}
