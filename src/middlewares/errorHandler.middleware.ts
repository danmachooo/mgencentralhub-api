import type { ErrorDetails, ErrorResponse } from "@/types/error"
import type { ErrorRequestHandler } from "express"
import { AppError } from "@/errors"
import { appConfig } from "@/config/appConfig"
import { z } from "zod"
import { logger } from "@/lib"
import { isApiError, getApiErrorStatus, isBodyParserJsonError } from "@/helpers/errorHandlerMiddleware"
import { handlePrismaKnownError, isPrismaKnownRequestError, isPrismaValidationError } from "@/helpers/prisma"

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
		logger.error("Server error:", {
			message: errObj.message,
			stack: errObj.stack,
			url: req.url,
			method: req.method,
			body: req.body,
			params: req.params,
			query: req.query,
		})
	} else {
		logger.warn("Client error:", {
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
