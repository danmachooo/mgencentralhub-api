import { bumpCacheGenerations, withVersionedCache } from "@/helpers/shared/cache/versioned-cache.helper"
import type { SystemQueryInput } from "@/schema"

const SYSTEM_CACHE_TTL_SECONDS = 180
const SYSTEM_LIST_CACHE_TTL_SECONDS = 120
const FAVORITE_CACHE_TTL_SECONDS = 90

function hashKeyPart(value: unknown) {
	return Buffer.from(JSON.stringify(value)).toString("base64url")
}

const generationKeys = {
	systemById: (systemId: string) => `systems:gen:by-id:${systemId}`,
	systemList: () => "systems:gen:list",
	deletedList: () => "systems:gen:deleted-list",
	favoriteListGlobal: () => "systems:gen:favorites:list:global",
	favoriteListUser: (userId: string) => `systems:gen:favorites:list:user:${userId}`,
	favoriteById: (userId: string, systemId: string) => `systems:gen:favorites:by-id:user:${userId}:system:${systemId}`,
	favoriteStatus: (userId: string, systemId: string) =>
		`systems:gen:favorites:status:user:${userId}:system:${systemId}`,
}

export const systemCacheKeys = {
	byId: (systemId: string) => `systems:by-id:${systemId}`,
	list: (departmentId: string | null, query: SystemQueryInput) =>
		`systems:list:department:${departmentId ?? "admin"}:${hashKeyPart(query)}`,
	deletedList: (query: SystemQueryInput) => `systems:deleted:list:${hashKeyPart(query)}`,
	favoriteList: (userId: string, query: SystemQueryInput) =>
		`systems:favorites:list:user:${userId}:${hashKeyPart(query)}`,
	favoriteById: (userId: string, systemId: string) => `systems:favorites:by-id:user:${userId}:system:${systemId}`,
	favoriteStatus: (userId: string, systemId: string) => `systems:favorites:status:user:${userId}:system:${systemId}`,
}

export async function withSystemByIdCache<T>(systemId: string, fn: () => Promise<T>) {
	return withVersionedCache({
		baseKey: systemCacheKeys.byId(systemId),
		generationKeys: [generationKeys.systemById(systemId)],
		ttl: SYSTEM_CACHE_TTL_SECONDS,
		fn,
		context: "systems.byId",
	})
}

export async function withSystemListCache<T>(
	query: SystemQueryInput,
	departmentId: string | null,
	fn: () => Promise<T>
) {
	return withVersionedCache({
		baseKey: systemCacheKeys.list(departmentId, query),
		generationKeys: [generationKeys.systemList()],
		ttl: SYSTEM_LIST_CACHE_TTL_SECONDS,
		fn,
		context: "systems.list",
	})
}

export async function withDeletedSystemListCache<T>(query: SystemQueryInput, fn: () => Promise<T>) {
	return withVersionedCache({
		baseKey: systemCacheKeys.deletedList(query),
		generationKeys: [generationKeys.deletedList()],
		ttl: SYSTEM_LIST_CACHE_TTL_SECONDS,
		fn,
		context: "systems.deletedList",
	})
}

export async function withFavoriteSystemListCache<T>(userId: string, query: SystemQueryInput, fn: () => Promise<T>) {
	return withVersionedCache({
		baseKey: systemCacheKeys.favoriteList(userId, query),
		generationKeys: [generationKeys.favoriteListGlobal(), generationKeys.favoriteListUser(userId)],
		ttl: FAVORITE_CACHE_TTL_SECONDS,
		fn,
		context: "systems.favoriteList",
	})
}

export async function withFavoriteSystemByIdCache<T>(userId: string, systemId: string, fn: () => Promise<T>) {
	return withVersionedCache({
		baseKey: systemCacheKeys.favoriteById(userId, systemId),
		generationKeys: [generationKeys.systemById(systemId), generationKeys.favoriteById(userId, systemId)],
		ttl: FAVORITE_CACHE_TTL_SECONDS,
		fn,
		context: "systems.favoriteById",
	})
}

export async function withFavoriteSystemStatusCache<T>(userId: string, systemId: string, fn: () => Promise<T>) {
	return withVersionedCache({
		baseKey: systemCacheKeys.favoriteStatus(userId, systemId),
		generationKeys: [generationKeys.systemById(systemId), generationKeys.favoriteStatus(userId, systemId)],
		ttl: FAVORITE_CACHE_TTL_SECONDS,
		fn,
		context: "systems.favoriteStatus",
	})
}

export async function invalidateSystemCollectionCaches() {
	await bumpCacheGenerations(
		[generationKeys.systemList(), generationKeys.deletedList(), generationKeys.favoriteListGlobal()],
		"systems.invalidateCollection"
	)
}

export async function invalidateSystemCache(systemId: string) {
	await bumpCacheGenerations(
		[
			generationKeys.systemById(systemId),
			generationKeys.systemList(),
			generationKeys.deletedList(),
			generationKeys.favoriteListGlobal(),
		],
		"systems.invalidateById"
	)
}

export async function invalidateFavoriteCache(userId: string, systemId: string) {
	await bumpCacheGenerations(
		[
			generationKeys.favoriteById(userId, systemId),
			generationKeys.favoriteStatus(userId, systemId),
			generationKeys.favoriteListUser(userId),
		],
		"systems.invalidateFavorite"
	)
}
