import { logger } from "@/lib/logger"
import { redis } from "@/lib/redis"

type CacheOptions = {
	ttl?: number
}

function withJitter(ttl: number) {
	return ttl + Math.floor(Math.random() * 15)
}

export async function cacheWrap<T>(key: string, fn: () => Promise<T>, options: CacheOptions = {}): Promise<T> {
	const ttl = options.ttl ?? 120

	try {
		const cached = await redis.get<T>(key)
		if (cached) return cached
	} catch {
		logger.error("Failed to get cached, failing silently ...")
	}

	const result = await fn()

	try {
		await redis.set(key, result, {
			ex: withJitter(ttl),
		})
	} catch {
		logger.error("Failed to set cached, failing silently ...")
	}

	return result
}
