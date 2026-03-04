import { AppError } from "@/errors"
import { isIpBlocked, blockIp, getRateLimitIdentity, getRequestIp, type RateLimitIdentity } from "@/helpers/shared/rate-limit"
import { redis } from "@/lib/redis"
import { logger } from "@/lib/logger"
import { asyncHandler } from "@/middlewares/async-handler.middleware"

type RateLimitOptions = {
	windowMs: number
	max: number
	message?: string
	keyPrefix?: string
	identity?: RateLimitIdentity
	setHeaders?: boolean
	blockDurationMs?: number
}

function getWindowKey(keyPrefix: string, subject: string, windowMs: number, now: number) {
	const slot = Math.floor(now / windowMs)
	return {
		key: `rate-limit:window:${keyPrefix}:${subject}:${slot}`,
		resetAtMs: (slot + 1) * windowMs,
	}
}

export const rateLimit = (options: RateLimitOptions) =>
	asyncHandler(async http => {
		const keyPrefix = options.keyPrefix ?? "global"
		const identity = options.identity ?? "user_or_ip"
		const setHeaders = options.setHeaders ?? true
		const now = Date.now()
		const subject = getRateLimitIdentity(http.req, identity)
		const ip = getRequestIp(http.req)

		try {
			if (options.blockDurationMs && (identity === "ip" || identity === "user_or_ip" || identity === "user_and_ip")) {
				const blocked = await isIpBlocked(keyPrefix, ip)
				if (blocked) {
					throw new AppError(429, options.message ?? "Too many requests. Please try again later.", {
						reason: "ip_blocked",
					})
				}
			}

			const { key, resetAtMs } = getWindowKey(keyPrefix, subject, options.windowMs, now)
			const totalInWindow = await redis.incr(key)

			if (totalInWindow === 1) {
				const ttlSeconds = Math.max(1, Math.ceil(options.windowMs / 1000))
				await redis.expire(key, ttlSeconds)
			}

			const retryAfterSeconds = Math.max(1, Math.ceil((resetAtMs - now) / 1000))
			const remaining = Math.max(options.max - totalInWindow, 0)

			if (setHeaders) {
				http.res.setHeader("X-RateLimit-Limit", String(options.max))
				http.res.setHeader("X-RateLimit-Remaining", String(remaining))
				http.res.setHeader("X-RateLimit-Reset", String(Math.floor(resetAtMs / 1000)))
			}

			if (totalInWindow > options.max) {
				http.res.setHeader("Retry-After", String(retryAfterSeconds))

				if (options.blockDurationMs && (identity === "ip" || identity === "user_or_ip" || identity === "user_and_ip")) {
					await blockIp(keyPrefix, ip, options.blockDurationMs)
				}

				throw new AppError(429, options.message ?? "Too many requests. Please try again later.", {
					retryAfterSeconds,
				})
			}
		} catch (error) {
			if (error instanceof AppError) throw error
			logger.error("Rate limiter failed. Allowing request to proceed.", {
				keyPrefix,
				error,
			})
		}

		http.next()
	})
