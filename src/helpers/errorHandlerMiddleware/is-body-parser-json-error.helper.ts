import type { ErrorShape } from "@/types/error"

// Express JSON parse errors often look like SyntaxError + type = 'entity.parse.failed'
export function isBodyParserJsonError(err: Error): boolean {
	const anyErr = err as ErrorShape
	return err instanceof SyntaxError && anyErr.type === "entity.parse.failed"
}
