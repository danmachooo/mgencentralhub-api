import { z } from "zod"
import { ValidationError } from "@/errors"
import { asyncHandler } from "@/middlewares"
import type { HttpContext } from "@/types/shared"
import { Router } from "express"
import { redis } from "@/lib/redis"
import { appConfig } from "@/config/app-config"

const router = Router()



if(appConfig.app.nodeEnv === "development") {
	router.get("/redis-test", async (_req, res) => {
		await redis.set("health:test", "ok", { ex: 60 })
		const value = await redis.get("health:test")
		return res.json({
			success: true,
			message: "OK",
			value,
		})
	})

	router.get(
		"/error",
		asyncHandler(async ({ req, res }: HttpContext) => {
			const type = String(req.query.type ?? "")

			switch (type) {
				case "app": {
					// hits: err instanceof AppError
					throw new ValidationError("Testing invalid (AppError)")
				}

				case "zod": {
					// hits: err instanceof z.ZodError
					const schema = z.object({
						email: z.email(),
						age: z.coerce.number().int().min(18),
					})

					// intentionally invalid (throws)
					schema.parse({ email: "not-an-email", age: 10 })

					// never reached
					return res.json({ success: true })
				}

				case "error": {
					// hits: default 500 branch
					throw new Error("Boom! Generic error")
				}

				case "async": {
					// hits: err instanceof AppError (via rejected promise)
					return Promise.reject(new ValidationError("Async rejection (AppError)"))
				}

				default: {
					return res.status(400).json({
						success: false,
						message: "Missing/invalid type. Use ?type=app|zod|error|async",
					})
				}
			}
		})
	)
}

router.get("/", (_req, res) => {
	return res.json({
		success: true,
		message: "OK",
	})
})


export default router
