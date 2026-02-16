import type { ErrorDetails, ErrorResponse } from "@/types/error"
import type { ErrorRequestHandler } from "express"
import { Prisma } from "@prisma/client"
import { AppError } from "@/errors"
import { appConfig } from "@/config/appConfig"
import { z } from "zod"
import Logger from "@/lib/logger"

const isDevelopment = appConfig.app.nodeEnv === "development"

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
	let statusCode = 500
	let message = "Internal server error"
	let errors: ErrorDetails | undefined = undefined

	if (err instanceof z.ZodError) {
		statusCode = 400
		message = "Validation error"
		errors = err.issues
	} else if (err instanceof AppError) {
		statusCode = err.statusCode
		message = err.message
	} else if (isPrismaKnownRequestError(err)) {
		const prismaError = handlePrismaKnownError(err)
		statusCode = prismaError.statusCode
		message = prismaError.message
		errors = prismaError.errors
	} else if (err instanceof Error && err.name === "JsonWebTokenError") {
		statusCode = 401
		message = "Invalid token"
	} else if (err instanceof Error && err.name === "TokenExpiredError") {
		statusCode = 401
		message = "Token expired"
	}

	const errObj = err instanceof Error ? err : new Error(String(err))

	if (statusCode >= 500) {
		Logger.error("Server error:", {
			message: errObj.message,
			stack: errObj.stack,
			url: req.url,
			method: req.method,
			body: req.body,
			params: req.params,
			query: req.query,
		})
	} else {
		Logger.warn("Client error:", {
			message: errObj.message,
			statusCode,
			url: req.url,
			method: req.method,
		})
	}

	const response: ErrorResponse = {
		success: false,
		message,
		...(errors ? { errors } : {}),
		...(!isDevelopment && { stack: errObj.stack }),
	}

	return res.status(statusCode).json(response)
}

function isPrismaKnownRequestError(err: unknown): err is Prisma.PrismaClientKnownRequestError {
	return err instanceof Prisma.PrismaClientKnownRequestError
}

function handlePrismaKnownError(err: Prisma.PrismaClientKnownRequestError): {
	statusCode: number
	message: string
	errors?: ErrorDetails
} {
	switch (err.code) {
		case "P2002": {
			const target = err.meta?.target
			const fields = Array.isArray(target) ? target.map(String) : target ? [String(target)] : []
			const joined = fields.length ? fields.join(", ") : "field"

			if (fields.includes("ownerId")) {
				return {
					statusCode: 409,
					message: "This user already has a team (one team per owner).",
					errors: { fields },
				}
			}

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
