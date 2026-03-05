import { gemini } from "@/lib/gemini"
import { appConfig } from "@/config/app-config"
import type { PromptInput } from "@/schema"

export type RequestLabels =
	| "PUBLIC_INFO"
	| "EVENT"
	| "PERSONAL_SYSTEM"
	| "DEPARTMENT_SYSTEM"
	| "STATUS_REPORT"
	| "UNKNOWN"

export async function classifyIntent(prompt: PromptInput): Promise<RequestLabels> {
	const result = await gemini.models.generateContent({
		model: appConfig.gemini.model,
		contents: [
			{
				role: "user",
				parts: [
					{
						text: `Classify this employee request: "${prompt.message}". Return ONLY one of these labels: PUBLIC_INFO, EVENT, PERSONAL_SYSTEM, DEPARTMENT_SYSTEM, STATUS_REPORT, UNKNOWN`,
					},
				],
			},
		],
	})


	const validLabels: RequestLabels[] = [
		"PUBLIC_INFO",
		"EVENT",
		"PERSONAL_SYSTEM",
		"DEPARTMENT_SYSTEM",
		"STATUS_REPORT",
		"UNKNOWN",
	]


	const isLabel = (v: string): v is RequestLabels => validLabels.includes(v as RequestLabels)

	const raw = result.text?.trim().toUpperCase()

	return raw && isLabel(raw) ? raw : "UNKNOWN"
}
