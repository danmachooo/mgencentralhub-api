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

	// Normalize unknown -> Error for logging + safe access
	const errObj = err instanceof Error ? err : new Error(String(err))

	// 1) Zod validation errors
	if (err instanceof z.ZodError) {
		statusCode = 400
		message = "Validation error"
		errors = err.issues
	}

	// 2) Custom AppError instances
	else if (err instanceof AppError) {
		statusCode = err.statusCode
		message = err.message
		// If your AppError supports details, add it here:
		// errors = err.details
	}

	// 3) Prisma known request errors (constraint, not found, etc.)
	else if (isPrismaKnownRequestError(err)) {
		const prismaError = handlePrismaKnownError(err)
		statusCode = prismaError.statusCode
		message = prismaError.message
		errors = prismaError.errors
	}

	// 4) Prisma validation errors (bad input shape)
	else if (isPrismaValidationError(errObj)) {
		statusCode = 400
		message = "Invalid input"
	}

	// 5) Better Auth / APIError (client-side issues often)
	else if (isApiError(errObj)) {
		// Prefer status code if the error provides one
		const apiStatus = getApiErrorStatus(errObj)
		statusCode = apiStatus ?? 400

		// Keep Better Auth message (it’s usually helpful)
		message = errObj.message

		// Optional: re-map some messages to cleaner ones
		if (/headers is required/i.test(errObj.message)) {
			statusCode = 401
			message = "Unauthorized (missing session cookie)"
		}
	}

	// 6) Invalid JSON body (Express body-parser)
	else if (isBodyParserJsonError(errObj)) {
		statusCode = 400
		message = "Invalid JSON in request body"
	}

	// 7) JWT errors
	else if (errObj.name === "JsonWebTokenError") {
		statusCode = 401
		message = "Invalid token"
	} else if (errObj.name === "TokenExpiredError") {
		statusCode = 401
		message = "Token expired"
	}

	// Logging
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
		...(isDevelopment && { stack: errObj.stack }),
	}

	return res.status(statusCode).json(response)
}

function isPrismaKnownRequestError(err: unknown): err is Prisma.PrismaClientKnownRequestError {
	return err instanceof Prisma.PrismaClientKnownRequestError
}

function isPrismaValidationError(err: Error): boolean {
	return (
		err.name === "PrismaClientValidationError" ||
		err instanceof Prisma.PrismaClientValidationError
	)
}

// Better Auth (and other libs) commonly throw { name: "APIError" }
function isApiError(err: Error): boolean {
	return err.name === "APIError"
}

// Try to read a status code if present (different libs use different keys)
function getApiErrorStatus(err: Error): number | undefined {
	const anyErr = err as any
	return (
		typeof anyErr.statusCode === "number" ? anyErr.statusCode :
		typeof anyErr.status === "number" ? anyErr.status :
		typeof anyErr.code === "number" ? anyErr.code :
		undefined
	)
}

// Express JSON parse errors often look like SyntaxError + type = 'entity.parse.failed'
function isBodyParserJsonError(err: Error): boolean {
	const anyErr = err as any
	return err instanceof SyntaxError && anyErr.type === "entity.parse.failed"
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
