import { appConfig } from "@/config/appConfig";
import { gemini } from "@/lib/gemini";
import type { Content } from "@google/genai";

export type ChatParams = {
    systemContext: string,
    conversation: Content[],
    userMessage: string
}

export async function chatWithGemini(params: ChatParams) {

    const contents = [
        {
            role: "user",
            parts: [
                {
                    text: `
You are an internal employee assistant.

Rules:
- Use ONLY the provided data.
- Never invent systems.
- If information is missing, say you don't know.

Context:
${params.systemContext}

User question:
${params.userMessage}       
                    `
                }
            ]
        }
    ]

    const finalContents = [...params.conversation, ...contents]

    const response = await gemini.models.generateContent({
        model: appConfig.gemini.model,
        contents: finalContents
    })

    return response.text ?? "I don't know based on the available context."
}
