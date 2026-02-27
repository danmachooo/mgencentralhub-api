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

const systemFlagErrors = new PrismaErrorHandler({
	entity: "System Flag",
	notFoundMessage: "System Flag not found.",
})

export async function createFlag(flag: CreateSystemFlagInput) {
	return systemFlagErrors.exec(() => createSystemFlag(flag))
}

export async function createManyFlags(flags: CreateManySystemFlagInput) {
	return systemFlagErrors.exec(() => createManySystemFlags(flags))
}

export async function updateFlag(flag: SystemFlagIdentifier, data: UpdateSystemFlagInput) {
	return systemFlagErrors.exec(() => updateSystemFlag(flag.id, data))
}

export async function restoreFlag(flag: SystemFlagIdentifier) {
	return systemFlagErrors.exec(() => restoreSystemFlag(flag.id))
}

export async function softDeleteFlag(flag: SystemFlagIdentifier) {
	return systemFlagErrors.exec(() => softDeleteSystemFlag(flag.id))
}

export async function hardDeleteFlag(flag: SystemFlagIdentifier) {
	return systemFlagErrors.exec(() => hardDeleteSystemFlag(flag.id))
}

export async function getInactiveSystemFlags() {
	return systemFlagErrors.exec(() => listSoftDeletedSystemFlags())
}

export async function getActiveSystemFlags() {
	return systemFlagErrors.exec(() => listSystemFlags())
}

export async function getActiveSystemFlagById(flag: SystemFlagIdentifier) {
	return systemFlagErrors.exec(() => listSystemFlagById(flag.id))
}
