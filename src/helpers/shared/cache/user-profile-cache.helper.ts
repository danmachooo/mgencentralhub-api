import { bumpCacheGenerations, withVersionedCache } from "@/helpers/shared/cache/versioned-cache.helper"
import type { UserProfileQuery } from "@/schema"

const USER_PROFILE_LIST_CACHE_TTL_SECONDS = 120

function hashKeyPart(value: unknown) {
	return Buffer.from(JSON.stringify(value)).toString("base64url")
}

const userProfileGenerationKeys = {
	list: () => "user-profiles:gen:list",
}

const userProfileCacheKeys = {
	list: (query: UserProfileQuery) => `user-profiles:list:${hashKeyPart(query)}`,
}

export async function withUserProfileListCache<T>(query: UserProfileQuery, fn: () => Promise<T>) {
	return withVersionedCache({
		baseKey: userProfileCacheKeys.list(query),
		generationKeys: [userProfileGenerationKeys.list()],
		ttl: USER_PROFILE_LIST_CACHE_TTL_SECONDS,
		fn,
		context: "userProfiles.list",
	})
}

export async function invalidateUserProfileListCache() {
	await bumpCacheGenerations([userProfileGenerationKeys.list()], "userProfiles.invalidateList")
}
