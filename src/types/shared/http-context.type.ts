import type { NextFunction, Request, Response } from "express"

export type HttpContext = {
	req: Request
	res: Response
	next: NextFunction
}
