import type { Prisma } from "@prisma/client"
import { AppError, ConflictError, NotFoundError, ValidationError } from "@/errors"

type PrismaErrorOptions = {
	entity?: string
	uniqueFieldLabels?: Record<string, string>
	notFoundMessage?: string
}

export function prismaToAppError(err: Prisma.PrismaClientKnownRequestError, opts?: PrismaErrorOptions): AppError {
	const entity = opts?.entity
	const labels = opts?.uniqueFieldLabels ?? {}

	switch (err.code) {
		case "P2002": {
			const target = err.meta?.target
			const fields = Array.isArray(target) ? target.map(String) : target ? [String(target)] : []

			const pretty = fields.map(f => labels[f] ?? f)
			const joined = pretty.length ? pretty.join(", ") : "field"

			return new ConflictError(
				entity ? `${entity} with this ${joined} already exists` : `Duplicate value for ${joined}`
			)
		}

		case "P2025":
			return new NotFoundError(opts?.notFoundMessage ?? (entity ? `${entity} not found` : "Record not found"))

		case "P2003":
			return new ValidationError(
				entity ? `Invalid reference while saving ${entity}` : "Invalid reference: related record does not exist"
			)

		case "P2014":
			return new ValidationError(
				entity
					? `Operation violates a required relation for ${entity}`
					: "Operation violates a required relation"
			)

		default:
			return new AppError(500, "Database error occurred")
	}
}
