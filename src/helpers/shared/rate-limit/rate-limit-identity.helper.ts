import type { Request } from "express"

export type RateLimitIdentity = "ip" | "user" | "user_or_ip" | "user_and_ip"

function normalizeIp(rawIp: string | undefined) {
	if (!rawIp) return "unknown"
	return rawIp.replace(/^::ffff:/, "")
}

function getOptionalUserId(req: Request) {
	const user = req.user
	if (!user || typeof user !== "object") return undefined

	const userId = user.userId

	if (typeof userId !== "string" || userId.length === 0) return undefined

	return userId
}

export function getRequestIp(req: Request) {
	const forwarded = req.headers["x-forwarded-for"]
	const forwardedValue = Array.isArray(forwarded) ? forwarded[0] : forwarded
	const ipFromForwarded = forwardedValue?.split(",")[0]?.trim()
	return normalizeIp(ipFromForwarded ?? req.ip)
}

export function getRateLimitIdentity(req: Request, strategy: RateLimitIdentity) {
	const userId = getOptionalUserId(req)
	const ip = getRequestIp(req)

	if (strategy === "ip") return `ip:${ip}`
	if (strategy === "user") return userId ? `user:${userId}` : "user:anonymous"
	if (strategy === "user_and_ip") return `user:${userId ?? "anonymous"}:ip:${ip}`
	return userId ? `user:${userId}` : `ip:${ip}`
}
