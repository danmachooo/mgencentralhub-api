export function isApiError(err: Error): boolean {
	return err.name === "APIError"
}
