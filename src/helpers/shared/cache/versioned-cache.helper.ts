import { logger, redis } from "@/lib"
import { cacheWrap } from "@/helpers/shared/cache/cache-wrap"

type VersionedCacheOptions<T> = {
	baseKey: string
	generationKeys: string[]
	ttl: number
	fn: () => Promise<T>
	context: string
}

function parseGeneration(value: unknown): number {
	if (typeof value === "number" && Number.isFinite(value) && value > 0) return value
	if (typeof value === "string") {
		const parsed = Number(value)
		if (Number.isFinite(parsed) && parsed > 0) return parsed
	}
	return 1
}

async function getGeneration(key: string): Promise<number> {
	const value = await redis.get<number | string>(key)
	return parseGeneration(value)
}

export async function withVersionedCache<T>(options: VersionedCacheOptions<T>) {
	const { baseKey, generationKeys, ttl, fn, context } = options

	try {
		const versions = await Promise.all(generationKeys.map(getGeneration))
		const versionedKey = `${baseKey}:v:${versions.join(".")}`
		return await cacheWrap(versionedKey, fn, { ttl })
	} catch (error) {
		logger.error("Failed to build versioned cache key. Falling back to source of truth.", {
			context,
			baseKey,
			generationKeys,
			error,
		})
		return fn()
	}
}

export async function bumpCacheGenerations(generationKeys: string[], context: string) {
	const uniqueKeys = [...new Set(generationKeys)]
	if (uniqueKeys.length === 0) return

	try {
		await Promise.all(uniqueKeys.map(key => redis.incr(key)))
	} catch (error) {
		logger.error("Failed to bump cache generations", { context, generationKeys: uniqueKeys, error })
		throw new Error("Cache consistency update failed")
	}
}
