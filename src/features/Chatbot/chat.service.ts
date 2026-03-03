import { saveMessage } from "@/features/Chatbot/chatbot.repo";
import { PrismaErrorHandler } from "@/helpers/prisma";
import { PromptInput, UserIdentifier } from "@/schema";
import { classifyIntent, RequestLabels } from "@/features/Chatbot/intent.service";
import { getRecentConversations } from "@/features/Chatbot/memory.service";
import { chatWithGemini } from "@/features/Chatbot/ai.service";


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

    return chatWithGemini({
        systemContext: "Department system data is currently unavailable.",
        conversation,
        userMessage: prompt.message
    })
}

async function handlePersonalSystems(user: UserIdentifier, prompt: PromptInput): Promise<string> {
    const conversation = await getRecentConversations(user)

    return chatWithGemini({
        systemContext: "Personal system data is currently unavailable.",
        conversation,
        userMessage: prompt.message
    })
}

