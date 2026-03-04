import { bumpCacheGenerations, withVersionedCache } from "@/helpers/shared/cache/versioned-cache.helper"
import type { DepartmentQueryInput } from "@/schema"

const DEPARTMENT_CACHE_TTL_SECONDS = 180
const DEPARTMENT_LIST_CACHE_TTL_SECONDS = 120

function hashKeyPart(value: unknown) {
	return Buffer.from(JSON.stringify(value)).toString("base64url")
}

const departmentGenerationKeys = {
	byId: (departmentId: string) => `departments:gen:by-id:${departmentId}`,
	activeList: () => "departments:gen:active-list",
	inactiveList: () => "departments:gen:inactive-list",
}

const departmentCacheKeys = {
	byId: (departmentId: string) => `departments:by-id:${departmentId}`,
	activeList: (query: DepartmentQueryInput) => `departments:active:list:${hashKeyPart(query)}`,
	inactiveList: (query: DepartmentQueryInput) => `departments:inactive:list:${hashKeyPart(query)}`,
}

export async function withDepartmentByIdCache<T>(departmentId: string, fn: () => Promise<T>) {
	return withVersionedCache({
		baseKey: departmentCacheKeys.byId(departmentId),
		generationKeys: [departmentGenerationKeys.byId(departmentId)],
		ttl: DEPARTMENT_CACHE_TTL_SECONDS,
		fn,
		context: "departments.byId",
	})
}

export async function withDepartmentListCache<T>(query: DepartmentQueryInput, fn: () => Promise<T>) {
	return withVersionedCache({
		baseKey: departmentCacheKeys.activeList(query),
		generationKeys: [departmentGenerationKeys.activeList()],
		ttl: DEPARTMENT_LIST_CACHE_TTL_SECONDS,
		fn,
		context: "departments.activeList",
	})
}

export async function withInactiveDepartmentListCache<T>(query: DepartmentQueryInput, fn: () => Promise<T>) {
	return withVersionedCache({
		baseKey: departmentCacheKeys.inactiveList(query),
		generationKeys: [departmentGenerationKeys.inactiveList()],
		ttl: DEPARTMENT_LIST_CACHE_TTL_SECONDS,
		fn,
		context: "departments.inactiveList",
	})
}

export async function invalidateDepartmentCollectionCaches() {
	await bumpCacheGenerations(
		[departmentGenerationKeys.activeList(), departmentGenerationKeys.inactiveList()],
		"departments.invalidateCollection"
	)
}

export async function invalidateDepartmentCache(departmentId: string) {
	await bumpCacheGenerations(
		[
			departmentGenerationKeys.byId(departmentId),
			departmentGenerationKeys.activeList(),
			departmentGenerationKeys.inactiveList(),
		],
		"departments.invalidateById"
	)
}
