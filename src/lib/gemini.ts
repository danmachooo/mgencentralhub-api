import { appConfig } from "@/config/appConfig"
import { GoogleGenAI } from "@google/genai"

export const gemini = new GoogleGenAI({
	apiKey: appConfig.gemini.apiKey,
})
