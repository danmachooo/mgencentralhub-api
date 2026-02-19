import type { ErrorShape } from "@/types/error"

// Try to read a status code if present (different libs use different keys)
export function getApiErrorStatus(err: Error): number | undefined {
	const anyErr = err as ErrorShape
	return typeof anyErr.statusCode === "number"
		? anyErr.statusCode
		: typeof anyErr.status === "number"
			? anyErr.status
			: typeof anyErr.code === "number"
				? anyErr.code
				: undefined
}
