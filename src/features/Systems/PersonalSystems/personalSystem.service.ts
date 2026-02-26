import type {
	CreatePersonalSystemInput,
	CreatorIdentifier,
	PersonalSystemIdentifier,
	PersonalSystemQueryInput,
	UpdatePersonalSystemInput,
} from "@/schema"
import { getUserAccessContext } from "@/features/Users/Profile/userProfile.service"
import { listSystemById, listSystems, updateSystem } from "@/features/Systems/system.repo"
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
	listSoftDeletedPersonalSystems,
	restorePersonalSystem,
	softDeletePersonalSystem,
	updateOnlyPersonalSystemImage,
} from "@/features/Systems/PersonalSystems/personalSystem.repo"
import { deleteFile, uploadFile } from "@/features/Storage/storage.service"
import { withResolvedImage, withResolvedImages } from "@/helpers/shared/storagePresenter.helper"

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

export async function createOwnSystem(
	creator: CreatorIdentifier,
	data: CreatePersonalSystemInput,
	file: Express.Multer.File | null
) {
	const ctx = await getUserAccessContext(creator)

	return personalSystemErrors.exec(async () => {
		const created = await createPersonalSystem(ctx.userId, data, null)

		let imageKey: string | null = null

		if (file) {
			try {
				imageKey = await uploadFile(file, "personal_systems")
			} catch (uploadErr) {
				await hardDeletePersonalSystem(created.id)
				throw uploadErr
			}
		}

		if (imageKey) {
			await updateOnlyPersonalSystemImage(created.id, imageKey)
		}

		return created
	})
}
export async function updateOwnSystem(
	system: PersonalSystemIdentifier,
	data: UpdatePersonalSystemInput,
	file: Express.Multer.File | null
) {
	await listPersonalSystemById(system.id)

	return personalSystemErrors.exec(async () => {
		const updated = await updateSystem(system.id, data, null)

		let imageKey: string | null = null

		if (file) {
			try {
				imageKey = await uploadFile(file, "personal_systems")
			} catch (uploadErr) {
				throw uploadErr
			}
		}

		if (imageKey) {
			await updateOnlyPersonalSystemImage(updated.id, imageKey)
		}
		return updated
	})
}

export async function toggleFavoritePersonalSystem(user: CreatorIdentifier, system: PersonalSystemIdentifier) {
	return personalSystemErrors.exec(() => flipFavoritePersonalSystem(user.id, system.id))
}

export async function restoreOwnSystem(system: PersonalSystemIdentifier) {
	return personalSystemErrors.exec(async () => {
		const _system = await restorePersonalSystem(system.id)
		return {
			restored: withResolvedImage(_system),
		}
	})
}

export async function softDeleteOwnSystem(system: PersonalSystemIdentifier) {
	return personalSystemErrors.exec(() => softDeletePersonalSystem(system.id))
}

export async function hardDeleteOwnSystem(system: PersonalSystemIdentifier) {
	const existing = await listPersonalSystemById(system.id)

	return personalSystemErrors.exec(async () => {
		const deleted = await hardDeletePersonalSystem(existing.id)
		await deleteFile(deleted.image)
	})
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
	return personalSystemErrors.exec(async () => {
		const { systems, total } = await listSystems(where, options)

		return { total, systems: await withResolvedImages(systems) }
	})
}

export async function getDeletedOwnSystems(query: PersonalSystemQueryInput) {
	const options = getPrismaPagination(query)

	const where: Prisma.PersonalSystemWhereInput = {
		...(query.search && {
			OR: [
				{ description: { contains: query.search, mode: "insensitive" } },
				{ name: { contains: query.search, mode: "insensitive" } },
				{ url: { contains: query.search, mode: "insensitive" } },
			],
		}),
	}

	return personalSystemErrors.exec(async () => {
		const { systems, total } = await listSoftDeletedPersonalSystems(where, options)

		return { total, deleted: await withResolvedImages(systems) }
	})
}

export async function getOwnSystemById(system: PersonalSystemIdentifier) {
	return personalSystemErrors.exec(async () => {
		const _system = await listSystemById(system.id)

		return { system: await withResolvedImage(_system) }
	})
}

export async function getFavoriteOwnSystemById(user: CreatorIdentifier, system: PersonalSystemIdentifier) {
	return personalSystemErrors.exec(async () => {
		const _system = await listFavoritePersonalSystemById(user.id, system.id)

		return {
			favorite: await withResolvedImage(_system),
		}
	})
}

export async function getFavoriteOwnSystems(creator: CreatorIdentifier, query: PersonalSystemQueryInput) {
	const options = getPrismaPagination(query)
	const where: Prisma.UserFavoritePersonalSystemWhereInput = {
		userId: creator.id,
		...(query.search && {
			OR: [
				{ personalSystem: { name: { contains: query.search, mode: "insensitive" } } },
				{ personalSystem: { url: { contains: query.search, mode: "insensitive" } } },
			],
		}),
	}
	return personalSystemErrors.exec(async () => {
		const { favoriteSystems, total } = await listFavoritePersonalSystems(where, options)
		return {
			favorites: await withResolvedImages(favoriteSystems),
			total,
		}
	})
}
