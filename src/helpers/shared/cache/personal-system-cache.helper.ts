import { bumpCacheGenerations, withVersionedCache } from "@/helpers/shared/cache/versioned-cache.helper"
import type { PersonalSystemQueryInput } from "@/schema"

const PERSONAL_SYSTEM_CACHE_TTL_SECONDS = 180
const PERSONAL_SYSTEM_LIST_CACHE_TTL_SECONDS = 120
const PERSONAL_SYSTEM_FAVORITE_CACHE_TTL_SECONDS = 90

function hashKeyPart(value: unknown) {
	return Buffer.from(JSON.stringify(value)).toString("base64url")
}

const personalSystemGenerationKeys = {
	byId: (userId: string, systemId: string) => `personal-systems:gen:by-id:user:${userId}:system:${systemId}`,
	list: (userId: string) => `personal-systems:gen:list:user:${userId}`,
	deletedList: (userId: string) => `personal-systems:gen:deleted-list:user:${userId}`,
	favoriteList: (userId: string) => `personal-systems:gen:favorites:list:user:${userId}`,
	favoriteById: (userId: string, systemId: string) =>
		`personal-systems:gen:favorites:by-id:user:${userId}:system:${systemId}`,
}

const personalSystemCacheKeys = {
	byId: (userId: string, systemId: string) => `personal-systems:by-id:user:${userId}:system:${systemId}`,
	list: (userId: string, query: PersonalSystemQueryInput) =>
		`personal-systems:list:user:${userId}:${hashKeyPart(query)}`,
	deletedList: (userId: string, query: PersonalSystemQueryInput) =>
		`personal-systems:deleted:list:user:${userId}:${hashKeyPart(query)}`,
	favoriteList: (userId: string, query: PersonalSystemQueryInput) =>
		`personal-systems:favorites:list:user:${userId}:${hashKeyPart(query)}`,
	favoriteById: (userId: string, systemId: string) =>
		`personal-systems:favorites:by-id:user:${userId}:system:${systemId}`,
}

export async function withOwnSystemByIdCache<T>(userId: string, systemId: string, fn: () => Promise<T>) {
	return withVersionedCache({
		baseKey: personalSystemCacheKeys.byId(userId, systemId),
		generationKeys: [personalSystemGenerationKeys.byId(userId, systemId)],
		ttl: PERSONAL_SYSTEM_CACHE_TTL_SECONDS,
		fn,
		context: "personalSystems.byId",
	})
}

export async function withOwnSystemListCache<T>(userId: string, query: PersonalSystemQueryInput, fn: () => Promise<T>) {
	return withVersionedCache({
		baseKey: personalSystemCacheKeys.list(userId, query),
		generationKeys: [personalSystemGenerationKeys.list(userId)],
		ttl: PERSONAL_SYSTEM_LIST_CACHE_TTL_SECONDS,
		fn,
		context: "personalSystems.list",
	})
}

export async function withOwnDeletedSystemListCache<T>(
	userId: string,
	query: PersonalSystemQueryInput,
	fn: () => Promise<T>
) {
	return withVersionedCache({
		baseKey: personalSystemCacheKeys.deletedList(userId, query),
		generationKeys: [personalSystemGenerationKeys.deletedList(userId)],
		ttl: PERSONAL_SYSTEM_LIST_CACHE_TTL_SECONDS,
		fn,
		context: "personalSystems.deletedList",
	})
}

export async function withFavoriteOwnSystemListCache<T>(
	userId: string,
	query: PersonalSystemQueryInput,
	fn: () => Promise<T>
) {
	return withVersionedCache({
		baseKey: personalSystemCacheKeys.favoriteList(userId, query),
		generationKeys: [personalSystemGenerationKeys.favoriteList(userId)],
		ttl: PERSONAL_SYSTEM_FAVORITE_CACHE_TTL_SECONDS,
		fn,
		context: "personalSystems.favoriteList",
	})
}

export async function withFavoriteOwnSystemByIdCache<T>(userId: string, systemId: string, fn: () => Promise<T>) {
	return withVersionedCache({
		baseKey: personalSystemCacheKeys.favoriteById(userId, systemId),
		generationKeys: [
			personalSystemGenerationKeys.byId(userId, systemId),
			personalSystemGenerationKeys.favoriteById(userId, systemId),
		],
		ttl: PERSONAL_SYSTEM_FAVORITE_CACHE_TTL_SECONDS,
		fn,
		context: "personalSystems.favoriteById",
	})
}

export async function invalidatePersonalSystemCollectionCaches(userId: string) {
	await bumpCacheGenerations(
		[
			personalSystemGenerationKeys.list(userId),
			personalSystemGenerationKeys.deletedList(userId),
			personalSystemGenerationKeys.favoriteList(userId),
		],
		"personalSystems.invalidateCollection"
	)
}

export async function invalidatePersonalSystemCache(userId: string, systemId: string) {
	await bumpCacheGenerations(
		[
			personalSystemGenerationKeys.byId(userId, systemId),
			personalSystemGenerationKeys.list(userId),
			personalSystemGenerationKeys.deletedList(userId),
			personalSystemGenerationKeys.favoriteList(userId),
			personalSystemGenerationKeys.favoriteById(userId, systemId),
		],
		"personalSystems.invalidateById"
	)
}

export async function invalidatePersonalFavoriteCache(userId: string, systemId: string) {
	await bumpCacheGenerations(
		[
			personalSystemGenerationKeys.favoriteList(userId),
			personalSystemGenerationKeys.favoriteById(userId, systemId),
		],
		"personalSystems.invalidateFavorite"
	)
}
