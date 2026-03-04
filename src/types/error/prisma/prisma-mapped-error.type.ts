import type { ErrorDetails, PrismaErrorKind } from "@/types/error"

export type PrismaMappedError = {
	statusCode: number
	kind: PrismaErrorKind
	message: string
	errors?: ErrorDetails
	meta?: Record<string, unknown>
}
