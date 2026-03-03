import { saveMessage } from "@/features/Chatbot/chatbot.repo";
import { PrismaErrorHandler } from "@/helpers/prisma";
import { CreatorIdentifier, PromptInput, UserIdentifier } from "@/schema";
import { classifyIntent, RequestLabels } from "@/features/Chatbot/intent.service";
import { getRecentConversations } from "@/features/Chatbot/memory.service";
import { chatWithGemini } from "@/features/Chatbot/ai.service";
import { getUserAccessContext } from "@/features/Users/Profile/userProfile.service";
import { getCompanySystems } from "@/features/Systems/system.service";
import { getOwnSystems } from "@/features/Systems/PersonalSystems/personalSystem.service";
import { NotFoundError } from "@/errors";


const employeeAssistantErrors = new PrismaErrorHandler({
    entity: "Chatbot"
})

export async function employeeAssistant(user: UserIdentifier, prompt: PromptInput) {
    
    await employeeAssistantErrors.exec(() => saveMessage(user, prompt, "user"))

    const intent: RequestLabels = await classifyIntent(prompt)

    let responseText = ""

    if(intent === "DEPARTMENT_SYSTEM") {
        responseText = await handleDepartmentSystems(user, prompt)
    } else if (intent === "PERSONAL_SYSTEM") {
        responseText = await handlePersonalSystems(user, prompt)
    } else {
        const conversation = await getRecentConversations(user)

        responseText = await chatWithGemini({   
            systemContext: "No structured data available.",
            conversation,
            userMessage: prompt.message
        })
    }

    await employeeAssistantErrors.exec(() => saveMessage(user, { message: responseText }, "assistant" ))

    return responseText
}   

async function handleDepartmentSystems(user: UserIdentifier, prompt: PromptInput): Promise<string> {
    const conversation = await getRecentConversations(user)
    const profile = await getUserAccessContext(user)

    const query = {
        page: 1,
        limit: 20,
        sortOrder: "desc" as const,
        sortBy: "createdAt" as const,
    }

    const departmentId = profile.department!.id
    const { systems, total } = await getCompanySystems(query, departmentId)

    const departmentContext = [
        `User Department: ${profile.department!.name}`,
        `User Department ID: ${departmentId}`,
        `Visible Department/Public Systems Count: ${total}`,
        ...systems.map((system, index) => {
            const status = system.systemFlag.name
            const isPublic = system.departmentMap.length === 0
            const isVisibleToUserDepartment = isPublic
                || system.departmentMap.some(dep => dep.departmentId === departmentId)
            const visibility = isPublic
                ? "PUBLIC"
                : isVisibleToUserDepartment
                    ? `DEPARTMENT_SCOPED (${profile.department!.name})`
                    : "NOT_FOR_YOUR_DEPARTMENT"

            return `${index + 1}. ${system.name} | url: ${system.url} | status: ${status} | visibility: ${visibility} | description: ${system.description ?? "N/A"}`
        }),
    ].join("\n")

    return chatWithGemini({
        systemContext: departmentContext,
        conversation,
        userMessage: prompt.message
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
        userMessage: prompt.message
    })
}
