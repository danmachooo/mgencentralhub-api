import type { Prisma } from "@prisma/client"
import type { ErrorDetails } from "@/types/error"

export function handlePrismaKnownError(err: Prisma.PrismaClientKnownRequestError): {
	statusCode: number
	message: string
	errors?: ErrorDetails
} {
	switch (err.code) {
		case "P2002": {
			const target = err.meta?.target
			const fields = Array.isArray(target) ? target.map(String) : target ? [String(target)] : []
			const joined = fields.length ? fields.join(", ") : "field"

			return {
				statusCode: 409,
				message: `A record with this ${joined} already exists`,
				errors: { fields },
			}
		}

		case "P2025":
			return { statusCode: 404, message: "Record not found" }

		case "P2003":
			return { statusCode: 400, message: "Invalid reference: related record does not exist" }

		case "P2014":
			return { statusCode: 400, message: "The change violates a required relation" }

		default:
			return { statusCode: 500, message: "Database error occurred" }
	}
}
