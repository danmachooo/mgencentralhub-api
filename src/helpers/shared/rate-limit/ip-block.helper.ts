import { redis } from "@/lib/redis"

function blockKey(prefix: string, ip: string) {
	return `rate-limit:block:${prefix}:${ip}`
}

export async function isIpBlocked(prefix: string, ip: string) {
	const key = blockKey(prefix, ip)
	const blocked = await redis.get<number | string | boolean>(key)
	return blocked === 1 || blocked === "1" || blocked === true
}

export async function blockIp(prefix: string, ip: string, durationMs: number) {
	const key = blockKey(prefix, ip)
	const ttlSeconds = Math.max(1, Math.ceil(durationMs / 1000))
	await redis.set(key, 1, { ex: ttlSeconds })
}

export async function unblockIp(prefix: string, ip: string) {
	const key = blockKey(prefix, ip)
	await redis.del(key)
}
