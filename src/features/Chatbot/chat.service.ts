import { saveMessage } from "@/features/Chatbot/chatbot.repo";
import { PrismaErrorHandler } from "@/helpers/prisma";
import { CreatorIdentifier, PromptInput, UserIdentifier } from "@/schema";
import { classifyIntent, RequestLabels } from "@/features/Chatbot/intent.service";
import { getRecentConversations } from "@/features/Chatbot/memory.service";
import { chatWithGemini } from "@/features/Chatbot/ai.service";
import { getUserAccessContext } from "@/features/Users/Profile/userProfile.service";
import { getCompanySystems } from "@/features/Systems/system.service";
import { getOwnSystems } from "@/features/Systems/PersonalSystems/personalSystem.service";
import { getActiveSystemFlags } from "@/features/Systems/SystemFlags/flag.service";
import { appConfig } from "@/config/appConfig";
import { gemini } from "@/lib/gemini";


const employeeAssistantErrors = new PrismaErrorHandler({
    entity: "Chatbot"
})

export async function employeeAssistant(user: UserIdentifier, prompt: PromptInput) {
    
    await employeeAssistantErrors.exec(() => saveMessage(user, prompt, "user"))

    const intent: RequestLabels = await classifyIntent(prompt)

    let responseText = ""

    if (intent === "PUBLIC_INFO") {
        responseText = await handlePublicInfo(user, prompt)
    } else if(intent === "DEPARTMENT_SYSTEM") {
        responseText = await handleDepartmentSystems(user, prompt)
    } else if (intent === "PERSONAL_SYSTEM") {
        responseText = await handlePersonalSystems(user, prompt)
    } else if (intent === "STATUS_REPORT") {
        responseText = await handleStatusReport(user, prompt)
    } else if (intent === "UNKNOWN") {
        responseText = await handleUnknownIntent(user, prompt)
    } else if (intent === "EVENT") {
        responseText = "Event intent is currently not supported by this assistant."
    }
    else {
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
                    `
                }
            ]
        }
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

    const query = {
        page: 1,
        limit: 100,
        sortOrder: "desc" as const,
        sortBy: "createdAt" as const,
    }

    const departmentId = profile.department!.id
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
        `User Department: ${profile.department!.name}`,
        `Total Visible Systems: ${total}`,
        `Available Status Flags: ${flags.map(flag => `${flag.name} (${flag.description ?? "No description"})`).join("; ")}`,
        ...Object.entries(systemsByStatus).map(([status, names]) => `${status}: ${names.length} system(s) -> ${names.join(", ")}`),
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
        systemContext: "Intent could not be classified. Ask clarifying questions and answer conservatively using only available context.",
        conversation,
        userMessage: prompt.message,
    })
}
