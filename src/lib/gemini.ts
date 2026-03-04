import { appConfig } from "@/config/app-config"
import { GoogleGenAI } from "@google/genai"

export const gemini = new GoogleGenAI({
	apiKey: appConfig.gemini.apiKey,
})
