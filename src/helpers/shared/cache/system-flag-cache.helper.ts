import { bumpCacheGenerations, withVersionedCache } from "@/helpers/shared/cache/versioned-cache.helper"

const SYSTEM_FLAG_CACHE_TTL_SECONDS = 300
const SYSTEM_FLAG_LIST_CACHE_TTL_SECONDS = 180

const systemFlagGenerationKeys = {
	byId: (flagId: string) => `system-flags:gen:by-id:${flagId}`,
	activeList: () => "system-flags:gen:active-list",
	inactiveList: () => "system-flags:gen:inactive-list",
}

const systemFlagCacheKeys = {
	byId: (flagId: string) => `system-flags:by-id:${flagId}`,
	activeList: () => "system-flags:active:list",
	inactiveList: () => "system-flags:inactive:list",
}

export async function withSystemFlagByIdCache<T>(flagId: string, fn: () => Promise<T>) {
	return withVersionedCache({
		baseKey: systemFlagCacheKeys.byId(flagId),
		generationKeys: [systemFlagGenerationKeys.byId(flagId)],
		ttl: SYSTEM_FLAG_CACHE_TTL_SECONDS,
		fn,
		context: "systemFlags.byId",
	})
}

export async function withActiveSystemFlagsCache<T>(fn: () => Promise<T>) {
	return withVersionedCache({
		baseKey: systemFlagCacheKeys.activeList(),
		generationKeys: [systemFlagGenerationKeys.activeList()],
		ttl: SYSTEM_FLAG_LIST_CACHE_TTL_SECONDS,
		fn,
		context: "systemFlags.activeList",
	})
}

export async function withInactiveSystemFlagsCache<T>(fn: () => Promise<T>) {
	return withVersionedCache({
		baseKey: systemFlagCacheKeys.inactiveList(),
		generationKeys: [systemFlagGenerationKeys.inactiveList()],
		ttl: SYSTEM_FLAG_LIST_CACHE_TTL_SECONDS,
		fn,
		context: "systemFlags.inactiveList",
	})
}

export async function invalidateSystemFlagCollectionCaches() {
	await bumpCacheGenerations(
		[systemFlagGenerationKeys.activeList(), systemFlagGenerationKeys.inactiveList()],
		"systemFlags.invalidateCollection"
	)
}

export async function invalidateSystemFlagCache(flagId: string) {
	await bumpCacheGenerations(
		[
			systemFlagGenerationKeys.byId(flagId),
			systemFlagGenerationKeys.activeList(),
			systemFlagGenerationKeys.inactiveList(),
		],
		"systemFlags.invalidateById"
	)
}
