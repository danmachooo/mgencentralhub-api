import { appConfig } from "@/config/appConfig";
import { gemini } from "@/lib/gemini";

const prompt = `

You are a 

`


export async function chatWithGemini(message: string) {

    const response = await gemini.models.generateContent({
        model: appConfig.gemini.model,
        contents: {
            role: "user",
            parts: [
                {

                }
            ]
        }
    })

    return response.text
}