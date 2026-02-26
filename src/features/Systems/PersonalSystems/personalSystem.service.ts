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
	flipFavoritePersonalSystem,
	hardDeletePersonalSystem,
	listFavoritePersonalSystemById,
	listFavoritePersonalSystems,
	listPersonalSystemById,
	restorePersonalSystem,
	softDeletePersonalSystem,
	updateOnlyPersonalSystemImage,
} from "@/features/Systems/PersonalSystems/personalSystem.repo"
import { uploadFile } from "@/features/Storage/storage.service"

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

export async function createOwnSystem(creator: CreatorIdentifier, data: CreatePersonalSystemInput, file: Express.Multer.File | null) {
	const ctx = await getUserAccessContext(creator)

	return personalSystemErrors.exec(async () => {
		const created = await createPersonalSystem(ctx.userId, data, null)

		let imageKey: string | null = null

		if(file) {
			try {
				imageKey = await uploadFile(file, "personal_systems")
			} catch(uploadErr) {
				await hardDeletePersonalSystem(created.id)
				throw uploadErr
			}
		}

		if(imageKey) {
			await updateOnlyPersonalSystemImage(created.id, imageKey)
		}

		return created
	})
}
export async function updateOwnSystem(system: PersonalSystemIdentifier, data: UpdatePersonalSystemInput) {
	await listPersonalSystemById(system.id)

	return personalSystemErrors.exec(() => updateSystem(system.id, data))
}

export async function toggleFavoritePersonalSystem(user: CreatorIdentifier, system: PersonalSystemIdentifier) {
	return personalSystemErrors.exec(() => flipFavoritePersonalSystem(user.id, system.id))
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

export async function getFavoriteOwnSystemById(user: CreatorIdentifier, system: PersonalSystemIdentifier) {
	return personalSystemErrors.exec(() => listFavoritePersonalSystemById(user.id, system.id))
}

export async function getFavoriteOwnSystems(creator: CreatorIdentifier, query: PersonalSystemQueryInput) {
	const options = getPrismaPagination(query)
	const where: Prisma.UserFavoritePersonalSystemWhereInput = {
		...(query.search && {
			OR: [
				{ personalSystem: { name: { contains: query.search, mode: "insensitive" } } },
				{ personalSystem: { url: { contains: query.search, mode: "insensitive" } } },
			],
		}),
	}
	return personalSystemErrors.exec(() => listFavoritePersonalSystems(where, options))
}
