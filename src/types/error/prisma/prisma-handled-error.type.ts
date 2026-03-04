import type { ErrorDetails } from "@/types/error"

export type PrismaHandledError = {
	statusCode: number
	message: string
	errors?: ErrorDetails
}
