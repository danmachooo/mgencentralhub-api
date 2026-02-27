import type {
	CreatePersonalSystemInput,
	CreatorIdentifier,
	PersonalSystemIdentifier,
	PersonalSystemQueryInput,
	UpdatePersonalSystemInput,
} from "@/schema"
import { getUserAccessContext } from "@/features/Users/Profile/userProfile.service"
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
	listPersonalSystems,
	listSoftDeletedPersonalSystems,
	restorePersonalSystem,
	softDeletePersonalSystem,
	updateOnlyPersonalSystemImage,
	updatePersonalSystem,
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
				await hardDeletePersonalSystem(created.id, ctx.userId)
				throw uploadErr
			}
		}

		if (imageKey) {
			await updateOnlyPersonalSystemImage(created.id, imageKey, ctx.userId)
		}

		return created
	})
}
export async function updateOwnSystem(
	system: PersonalSystemIdentifier,
	creator: CreatorIdentifier,
	data: UpdatePersonalSystemInput,
	file: Express.Multer.File | null
) {
	await listPersonalSystemById(system.id, creator.id)

	return personalSystemErrors.exec(async () => {
		const updated = await updatePersonalSystem(system.id, creator.id, data, null)

		let imageKey: string | null = null

		if (file) {
			imageKey = await uploadFile(file, "personal_systems")
		}

		if (imageKey) {
			await updateOnlyPersonalSystemImage(updated.id, imageKey, creator.id)
		}
		return updated
	})
}

export async function toggleFavoritePersonalSystem(creator: CreatorIdentifier, system: PersonalSystemIdentifier) {
	return personalSystemErrors.exec(() => flipFavoritePersonalSystem(creator.id, system.id))
}

export async function restoreOwnSystem(system: PersonalSystemIdentifier, creator: CreatorIdentifier) {
	return personalSystemErrors.exec(async () => {
		const _system = await restorePersonalSystem(system.id, creator.id)
		return {
			restored: withResolvedImage(_system),
		}
	})
}

export async function softDeleteOwnSystem(system: PersonalSystemIdentifier, creator: CreatorIdentifier) {
	return personalSystemErrors.exec(() => softDeletePersonalSystem(system.id, creator.id))
}

export async function hardDeleteOwnSystem(system: PersonalSystemIdentifier, creator: CreatorIdentifier) {
	const existing = await listPersonalSystemById(system.id, creator.id)

	return personalSystemErrors.exec(async () => {
		const deleted = await hardDeletePersonalSystem(existing.id, creator.id)
		await deleteFile(deleted.image)
	})
}

export async function getOwnSystems(query: PersonalSystemQueryInput, creator: CreatorIdentifier) {
	const options = getPrismaPagination(query)

	const where: Prisma.PersonalSystemWhereInput = {
		ownerUserId: creator.id,
		...(query.search && {
			OR: [
				{ description: { contains: query.search, mode: "insensitive" } },
				{ name: { contains: query.search, mode: "insensitive" } },
				{ url: { contains: query.search, mode: "insensitive" } },
			],
		}),
	}
	return personalSystemErrors.exec(async () => {
		const { systems, total } = await listPersonalSystems(where, options)

		return { total, systems: await withResolvedImages(systems) }
	})
}

export async function getDeletedOwnSystems(query: PersonalSystemQueryInput, creator: CreatorIdentifier) {
	const options = getPrismaPagination(query)

	const where: Prisma.PersonalSystemWhereInput = {
		ownerUserId: creator.id,
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

export async function getOwnSystemById(system: PersonalSystemIdentifier, creator: CreatorIdentifier) {
	return personalSystemErrors.exec(async () => {
		const _system = await listPersonalSystemById(system.id, creator.id)

		return { system: await withResolvedImage(_system) }
	})
}

export async function getFavoriteOwnSystemById(system: PersonalSystemIdentifier, creator: CreatorIdentifier) {
	return personalSystemErrors.exec(async () => {
		const _system = await listFavoritePersonalSystemById(system.id, creator.id)

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
