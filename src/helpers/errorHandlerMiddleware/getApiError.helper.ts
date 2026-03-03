import type { ErrorShape } from "@/types/error"

// Try to read a status code if present (different libs use different keys)

export function getApiErrorStatus(err: Error): number | undefined {
	const anyErr = err as ErrorShape

	if (typeof anyErr.statusCode === "number") {
		return anyErr.statusCode
	}

	if (typeof anyErr.status === "number") {
		return anyErr.status
	}

	if (typeof anyErr.code === "number") {
		return anyErr.code
	}

	return undefined
}
