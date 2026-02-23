import type {
	CreateSystemInput,
	CreatorIdentifier,
	SystemIdentifier,
	SystemQueryInput,
	UpdateSystemInput,
} from "@/schema"
import { getUserAccessContext } from "@/features/UserProfiles/userProfile.service"
import { NotFoundError } from "@/errors"
import {
	createSystem,
	hardDeleteSystem,
	listSoftDeletedSystems,
	listSystemById,
	listSystems,
	restoreSystem,
	softDeleteSystem,
	updateSystem,
} from "@/features/Systems/system.repo"
import { PrismaErrorHandler } from "@/helpers/prisma"
import type { Prisma } from "@prisma/client"
import { getPrismaPagination } from "@/helpers/prisma/getPrismaPagination.helper"

const systemErrors = new PrismaErrorHandler({
	entity: "System",
	uniqueFieldLabels: {
		url: "System url",
	},
	uniqueConstraintToField: {
		system_url_key: "url",
		system_name_key: "name",
	},
	notFoundMessage: "System not found.",
})

export async function createCompanySystem(creator: CreatorIdentifier, data: CreateSystemInput) {
	const ctx = await getUserAccessContext(creator)

	if (!ctx) throw new NotFoundError("User was not found.")

	return systemErrors.exec(() => createSystem(ctx.userId, data))
}
export async function updateCompanySystem(system: SystemIdentifier, data: UpdateSystemInput) {
	const isFound = await listSystemById(system.id)

	if (!isFound) throw new NotFoundError("System was not found.")

	return systemErrors.exec(() => updateSystem(system.id, data))
}

export async function getCompanySystems(query: SystemQueryInput) {
	const options = getPrismaPagination(query)

	const where: Prisma.SystemWhereInput = {
		systemFlag: {
			name: query.status,
		},
		...(query.search && {
			OR: [
				{ name: { contains: query.search, mode: "insensitive" } },
				{ url: { contains: query.search, mode: "insensitive" } },
			],
		}),
	}
	return systemErrors.exec(() => listSystems(where, options))
}

export async function getDeletedCompanySystems(query: SystemQueryInput) {
	const options = getPrismaPagination(query)

	const where: Prisma.SystemWhereInput = {
		systemFlag: {
			name: query.status,
		},
		...(query.search && {
			OR: [
				{ name: { contains: query.search, mode: "insensitive" } },
				{ url: { contains: query.search, mode: "insensitive" } },
			],
		}),
	}

	return systemErrors.exec(() => listSoftDeletedSystems(where, options))
}

export async function getCompanySystemById(system: SystemIdentifier) {
	return systemErrors.exec(() => listSystemById(system.id))
}

export async function restoreCompanySystem(system: SystemIdentifier) {
	return systemErrors.exec(() => restoreSystem(system.id))
}

export async function softDeleteCompanySystem(system: SystemIdentifier) {
	return systemErrors.exec(() => softDeleteSystem(system.id))
}

export async function hardDeleteCompanySystem(system: SystemIdentifier) {
	return systemErrors.exec(() => hardDeleteSystem(system.id))
}
