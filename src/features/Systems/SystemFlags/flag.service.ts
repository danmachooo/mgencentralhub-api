import {
	createManySystemFlags,
	createSystemFlag,
	hardDeleteSystemFlag,
	listSoftDeletedSystemFlags,
	listSystemFlagById,
	listSystemFlags,
	restoreSystemFlag,
	softDeleteSystemFlag,
	updateSystemFlag,
} from "@/features/Systems/SystemFlags/flag.repo"
import { PrismaErrorHandler } from "@/helpers/prisma"
import type {
	CreateManySystemFlagInput,
	CreateSystemFlagInput,
	SystemFlagIdentifier,
	UpdateSystemFlagInput,
} from "@/schema"
import {
	invalidateSystemFlagCache,
	invalidateSystemFlagCollectionCaches,
	withActiveSystemFlagsCache,
	withInactiveSystemFlagsCache,
	withSystemFlagByIdCache,
} from "@/helpers/shared/cache/system-flag-cache.helper"

const systemFlagErrors = new PrismaErrorHandler({
	entity: "System Flag",
	notFoundMessage: "System Flag not found.",
})

export async function createFlag(flag: CreateSystemFlagInput) {
	return systemFlagErrors.exec(async () => {
		const created = await createSystemFlag(flag)
		await invalidateSystemFlagCollectionCaches()
		return created
	})
}

export async function createManyFlags(flags: CreateManySystemFlagInput) {
	return systemFlagErrors.exec(async () => {
		const created = await createManySystemFlags(flags)
		await invalidateSystemFlagCollectionCaches()
		return created
	})
}

export async function updateFlag(flag: SystemFlagIdentifier, data: UpdateSystemFlagInput) {
	return systemFlagErrors.exec(async () => {
		const updated = await updateSystemFlag(flag.id, data)
		await invalidateSystemFlagCache(flag.id)
		return updated
	})
}

export async function restoreFlag(flag: SystemFlagIdentifier) {
	return systemFlagErrors.exec(async () => {
		const restored = await restoreSystemFlag(flag.id)
		await invalidateSystemFlagCache(flag.id)
		return restored
	})
}

export async function softDeleteFlag(flag: SystemFlagIdentifier) {
	return systemFlagErrors.exec(async () => {
		const deleted = await softDeleteSystemFlag(flag.id)
		await invalidateSystemFlagCache(flag.id)
		return deleted
	})
}

export async function hardDeleteFlag(flag: SystemFlagIdentifier) {
	return systemFlagErrors.exec(async () => {
		const deleted = await hardDeleteSystemFlag(flag.id)
		await invalidateSystemFlagCache(flag.id)
		return deleted
	})
}

export async function getInactiveSystemFlags() {
	return withInactiveSystemFlagsCache(() => systemFlagErrors.exec(() => listSoftDeletedSystemFlags()))
}

export async function getActiveSystemFlags() {
	return withActiveSystemFlagsCache(() => systemFlagErrors.exec(() => listSystemFlags()))
}

export async function getActiveSystemFlagById(flag: SystemFlagIdentifier) {
	return withSystemFlagByIdCache(flag.id, () => systemFlagErrors.exec(() => listSystemFlagById(flag.id)))
}
