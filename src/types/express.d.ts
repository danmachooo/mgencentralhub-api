import "express"

declare global {
	namespace Express {
		interface Request {
			user: {
				id: string
				role?: {
					id: string
					name: string
				}
				department?: {
					id: string
					name: string
				} | null // employee may not have a department
			}
		}
	}
}
