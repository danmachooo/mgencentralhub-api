import { gemini } from "@/lib/gemini";
import { appConfig } from "@/config/appConfig";
import type { PromptInput } from "@/schema";

export type RequestLabels = 
  | "PUBLIC_INFO" 
  | "EVENT" 
  | "PERSONAL_SYSTEM" 
  | "DEPARTMENT_SYSTEM" 
  | "STATUS_REPORT" 
  | "UNKNOWN";

export async function classifyIntent(prompt: PromptInput): Promise<RequestLabels> {
  const result = await gemini.models.generateContent({
    model: appConfig.gemini.model,
    contents: [{ 
      role: 'user', 
        parts: [{ text: `Classify this employee request: "${prompt.message}". Return ONLY one of these labels: PUBLIC_INFO, EVENT, PERSONAL_SYSTEM, DEPARTMENT_SYSTEM, STATUS_REPORT, UNKNOWN` }] 
    }],
  });

  const label = result.text?.trim().toUpperCase() as RequestLabels

  const validLabels: RequestLabels[] = [
    "PUBLIC_INFO", "EVENT", "PERSONAL_SYSTEM", "DEPARTMENT_SYSTEM", "STATUS_REPORT", "UNKNOWN"
  ];

  return validLabels.includes(label) ? label : "UNKNOWN";
}
