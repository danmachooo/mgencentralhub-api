import type { ErrorDetails } from "@/types/error"

export type ErrorResponse = {
	success: false
	message: string
	errors?: ErrorDetails
	stack?: string
}
