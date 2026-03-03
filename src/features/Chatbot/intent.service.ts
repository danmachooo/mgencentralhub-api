import { gemini } from "@/lib/gemini";

export async function classifyIntent(message: string) {
  const response = await gemini.models.generateContent({
    model: "gemini-1.5-flash",
    contents: `
Classify this employee request:

"${message}"

Return ONLY one of these labels:
- PUBLIC_INFO
- EVENT
- PERSONAL_SYSTEM
- DEPARTMENT_SYSTEM
- STATUS_REPORT
- GENERAL_DOC
- UNKNOWN
`,
  });

  return response.text?.trim();
}