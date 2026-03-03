import { AppError } from "@/errors"
import { asyncHandler } from "@/middlewares/asyncHandler.middleware"
import type { Request } from "express"

type RateLimitOptions = {
	windowMs: number
	max: number
	message?: string
	keyPrefix?: string
}

type Bucket = {
	count: number
	resetAt: number
}

const buckets = new Map<string, Bucket>()

function pruneExpiredBuckets(now: number) {
	for (const [key, bucket] of buckets) {
		if (bucket.resetAt <= now) {
			buckets.delete(key)
		}
	}
}

function getClientKey(req: Request, keyPrefix: string): string {
	const userKey = req.user.userId
	const ipKey = req.ip
	return `${keyPrefix}:${userKey}:${ipKey}`
}

export const rateLimit = (options: RateLimitOptions) =>
	asyncHandler(http => {
		const now = Date.now()
		pruneExpiredBuckets(now)

		const keyPrefix = options.keyPrefix ?? "global"
		const key = getClientKey(http.req, keyPrefix)
		const existing = buckets.get(key)

		if (!existing || existing.resetAt <= now) {
			buckets.set(key, {
				count: 1,
				resetAt: now + options.windowMs,
			})
			return http.next()
		}

		if (existing.count >= options.max) {
			const retryAfterSeconds = Math.ceil((existing.resetAt - now) / 1000)
			http.res.setHeader("Retry-After", String(retryAfterSeconds))

			throw new AppError(429, options.message ?? "Too many requests. Please try again later.", {
				retryAfterSeconds,
			})
		}

		existing.count += 1
		buckets.set(key, existing)
		http.next()
	})
