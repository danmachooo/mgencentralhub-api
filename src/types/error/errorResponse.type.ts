import type { ErrorDetails } from "./errorDetails.type"

export type ErrorResponse = {
	success: false
	message: string
	errors?: ErrorDetails
	stack?: string
}
