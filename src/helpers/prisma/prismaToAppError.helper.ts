import type { Prisma } from "@prisma/client"
import { AppError, ConflictError, NotFoundError, ValidationError } from "@/errors"

type PrismaErrorOptions = {
	entity?: string
	uniqueFieldLabels?: Record<string, string>
	notFoundMessage?: string

	/**
	 * Optional mapping when Prisma meta.target is missing (common with adapter-pg).
	 * Key: constraint name e.g. "systems_url_key"
	 * Value: field name e.g. "url" (or a friendly label if you want)
	 */
	uniqueConstraintToField?: Record<string, string>
}

export function prismaToAppError(
	err: Prisma.PrismaClientKnownRequestError,
	opts?: PrismaErrorOptions
): AppError {
	const entity = opts?.entity
	const labels = opts?.uniqueFieldLabels ?? {}
	const constraintToField = opts?.uniqueConstraintToField ?? {}

	switch (err.code) {
		case "P2002": {
			// 1) Try Prisma's target (works in many Prisma setups)
			const target = err.meta?.target
			let fields = Array.isArray(target) ? target.map(String) : target ? [String(target)] : []

			// 2) Adapter-PG fallback: infer field from constraint name/message
			if (fields.length === 0) {
				const metaAny = err.meta as any
				const driver = metaAny?.driverAdapterError
				const originalMessage: string | undefined = driver?.cause?.originalMessage
				const constraintName: string | undefined = driver?.cause?.constraint?.name

				const constraintFromMessage =
					originalMessage?.match(/unique constraint "([^"]+)"/)?.[1]

				const constraint = constraintName ?? constraintFromMessage

				// If user provided mapping, use it
				const mappedField = constraint ? constraintToField[constraint] : undefined

				// Otherwise do a small best-effort inference (url/name are common)
				const inferredField =
					mappedField ??
					(constraint?.includes("_url_") || constraint?.endsWith("_url_key")
						? "url"
						: constraint?.includes("_name_") || constraint?.endsWith("_name_key")
							? "name"
							: undefined)

				if (inferredField) fields = [inferredField]
			}

			// ✅ Your preferred behavior:
			// - Message: short ("System already exists")
			// - Details: include fields when we know them
			const msg = entity ? `${entity} already exists` : "Resource already exists"

			return new ConflictError(
				msg,
				fields.length ? { fields } : undefined
			)
		}

		case "P2025":
			return new NotFoundError(
				opts?.notFoundMessage ?? (entity ? `${entity} not found` : "Record not found")
			)

		case "P2003":
			return new ValidationError(
				entity ? `Invalid reference while saving ${entity}` : "Invalid reference: related record does not exist"
			)

		case "P2014":
			return new ValidationError(
				entity ? `Operation violates a required relation for ${entity}` : "Operation violates a required relation"
			)

		default:
			return new AppError(500, "Database error occurred")
	}
}
