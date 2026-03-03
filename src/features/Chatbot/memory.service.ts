import { fetchRecentConversations } from "@/features/Chatbot/chatbot.repo";
import { PrismaErrorHandler } from "@/helpers/prisma";
import { UserIdentifier } from "@/schema";
import type { Content } from "@google/genai";

const memoryErrors = new PrismaErrorHandler({
    entity: "Chatbot"
})

export async function getRecentConversations(user: UserIdentifier): Promise<Content[]> {
    const messages = await memoryErrors.exec(() => fetchRecentConversations(user))

    return messages.map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{
            text: msg.content
        }]
    }))
}
