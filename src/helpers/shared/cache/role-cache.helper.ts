import { bumpCacheGenerations, withVersionedCache } from "@/helpers/shared/cache/versioned-cache.helper"

const ROLE_CACHE_TTL_SECONDS = 300
const ROLE_LIST_CACHE_TTL_SECONDS = 180

const roleGenerationKeys = {
	byId: (roleId: string) => `roles:gen:by-id:${roleId}`,
	activeList: () => "roles:gen:active-list",
	inactiveList: () => "roles:gen:inactive-list",
}

const roleCacheKeys = {
	byId: (roleId: string) => `roles:by-id:${roleId}`,
	activeList: () => "roles:active:list",
	inactiveList: () => "roles:inactive:list",
}

export async function withRoleByIdCache<T>(roleId: string, fn: () => Promise<T>) {
	return withVersionedCache({
		baseKey: roleCacheKeys.byId(roleId),
		generationKeys: [roleGenerationKeys.byId(roleId)],
		ttl: ROLE_CACHE_TTL_SECONDS,
		fn,
		context: "roles.byId",
	})
}

export async function withActiveRolesCache<T>(fn: () => Promise<T>) {
	return withVersionedCache({
		baseKey: roleCacheKeys.activeList(),
		generationKeys: [roleGenerationKeys.activeList()],
		ttl: ROLE_LIST_CACHE_TTL_SECONDS,
		fn,
		context: "roles.activeList",
	})
}

export async function withInactiveRolesCache<T>(fn: () => Promise<T>) {
	return withVersionedCache({
		baseKey: roleCacheKeys.inactiveList(),
		generationKeys: [roleGenerationKeys.inactiveList()],
		ttl: ROLE_LIST_CACHE_TTL_SECONDS,
		fn,
		context: "roles.inactiveList",
	})
}

export async function invalidateRoleCollectionCaches() {
	await bumpCacheGenerations(
		[roleGenerationKeys.activeList(), roleGenerationKeys.inactiveList()],
		"roles.invalidateCollection"
	)
}

export async function invalidateRoleCache(roleId: string) {
	await bumpCacheGenerations(
		[roleGenerationKeys.byId(roleId), roleGenerationKeys.activeList(), roleGenerationKeys.inactiveList()],
		"roles.invalidateById"
	)
}
