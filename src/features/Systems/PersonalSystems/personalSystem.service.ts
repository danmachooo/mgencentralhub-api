import type {
	CreatePersonalSystemInput,
	CreatorIdentifier,
	PersonalSystemIdentifier,
	PersonalSystemQueryInput,
	UpdatePersonalSystemInput,
} from "@/schema"
import { getUserAccessContext } from "@/features/UserProfiles/userProfile.service"
import { listSoftDeletedSystems, listSystems, updateSystem } from "@/features/Systems/system.repo"
import { PrismaErrorHandler } from "@/helpers/prisma"
import type { Prisma } from "@prisma/client"
import { getPrismaPagination } from "@/helpers/prisma/getPrismaPagination.helper"
import {
	createPersonalSystem,
	hardDeletePersonalSystem,
	listPersonalSystemById,
	restorePersonalSystem,
	softDeletePersonalSystem,
} from "@/features/Systems/PersonalSystems/personalSystem.repo"

const personalSystemErrors = new PrismaErrorHandler({
	entity: "Personal System",
	uniqueFieldLabels: {
		url: "Personal System url",
	},
	uniqueConstraintToField: {
		system_url_key: "url",
		system_name_key: "name",
	},
	notFoundMessage: "Personal System not found.",
})

export async function createOwnSystem(creator: CreatorIdentifier, data: CreatePersonalSystemInput) {
	const ctx = await getUserAccessContext(creator)

	return personalSystemErrors.exec(() => createPersonalSystem(ctx.userId, data))
}
export async function updateOwnSystem(system: PersonalSystemIdentifier, data: UpdatePersonalSystemInput) {
	await listPersonalSystemById(system.id)

	return personalSystemErrors.exec(() => updateSystem(system.id, data))
}

export async function getOwnSystems(query: PersonalSystemQueryInput) {
	const options = getPrismaPagination(query)

	const where: Prisma.SystemWhereInput = {
		...(query.search && {
			OR: [
				{ description: { contains: query.search, mode: "insensitive" } },
				{ name: { contains: query.search, mode: "insensitive" } },
				{ url: { contains: query.search, mode: "insensitive" } },
			],
		}),
	}
	return personalSystemErrors.exec(() => listSystems(where, options))
}

export async function getDeletedOwnSystems(query: PersonalSystemQueryInput) {
	const options = getPrismaPagination(query)

	const where: Prisma.SystemWhereInput = {
		...(query.search && {
			OR: [
				{ description: { contains: query.search, mode: "insensitive" } },
				{ name: { contains: query.search, mode: "insensitive" } },
				{ url: { contains: query.search, mode: "insensitive" } },
			],
		}),
	}

	return personalSystemErrors.exec(() => listSoftDeletedSystems(where, options))
}

export async function getOwnSystemById(system: PersonalSystemIdentifier) {
	return personalSystemErrors.exec(() => listPersonalSystemById(system.id))
}

export async function restoreOwnSystem(system: PersonalSystemIdentifier) {
	return personalSystemErrors.exec(() => restorePersonalSystem(system.id))
}

export async function softDeleteOwnSystem(system: PersonalSystemIdentifier) {
	return personalSystemErrors.exec(() => softDeletePersonalSystem(system.id))
}

export async function hardDeleteOwnSystem(system: PersonalSystemIdentifier) {
	return personalSystemErrors.exec(() => hardDeletePersonalSystem(system.id))
}
