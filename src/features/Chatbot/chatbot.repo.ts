import { prisma } from "@/lib"
import type { PromptInput, UserIdentifier } from "@/schema"

export async function fetchRecentConversations(user: UserIdentifier) {
	const messages = await prisma.chatbotMessage.findMany({
		where: {
			userId: user.id,
		},
		orderBy: {
			createdAt: "asc",
		},
		take: 6,
	})

	return messages
}

export async function saveMessage(user: UserIdentifier, prompt: PromptInput, role: "user" | "assistant") {
	return await prisma.chatbotMessage.create({
		data: {
			userId: user.id,
			content: prompt.message,
			role,
		},
	})
}
