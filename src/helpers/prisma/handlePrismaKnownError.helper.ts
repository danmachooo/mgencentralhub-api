import type { Prisma } from "@prisma/client"
import type { ErrorDetails } from "@/types/error"
import type { PrismaMappedError } from "@/types/error/prisma/prismaMappedError.type"

export function handlePrismaKnownError(err: Prisma.PrismaClientKnownRequestError): PrismaMappedError {
	switch (err.code) {
		case "P2002": {
			const target = err.meta?.target
			const fields = Array.isArray(target) ? target.map(String) : target ? [String(target)] : []
			const joined = fields.length ? fields.join(", ") : "field"

			return {
				statusCode: 409,
				kind: "unique_violation",
				message: `Duplicate value for: ${joined}`,
				errors: fields.length ? ({ fields } as ErrorDetails) : undefined,
				meta: err.meta as Record<string, unknown>,
			}
		}

		case "P2025":
			return {
				statusCode: 404,
				kind: "not_found",
				message: "Record not found",
				meta: err.meta as Record<string, unknown>,
			}

		case "P2003":
			return {
				statusCode: 400,
				kind: "fk_violation",
				message: "Invalid reference: related record does not exist",
				meta: err.meta as Record<string, unknown>,
			}

		case "P2014":
			return {
				statusCode: 400,
				kind: "relation_violation",
				message: "Operation violates a required relation",
				meta: err.meta as Record<string, unknown>,
			}

		default:
			return {
				statusCode: 500,
				kind: "db_error",
				message: "Database error occurred",
				meta: err.meta as Record<string, unknown>,
			}
	}
}
