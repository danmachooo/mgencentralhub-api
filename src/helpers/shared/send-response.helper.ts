import type { Response } from "express"

export type ApiResponse<T = unknown> = {
	success: boolean
	statusCode: number
	message: string
	data?: T
}

export function sendResponse<T>(res: Response, success: boolean, statusCode: number, message: string, data?: T) {
	const response: ApiResponse<T> = {
		success,
		statusCode,
		message,
		data,
	}

	return res.status(statusCode).json(response)
}
