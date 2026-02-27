import type {
	CreateManySystemInput,
	CreateSystemInput,
	CreatorIdentifier,
	SystemIdentifier,
	SystemQueryInput,
	UpdateSystemInput,
} from "@/schema"
import { getUserAccessContext } from "@/features/Users/Profile/userProfile.service"
import {
	createManySystem,
	createSystem,
	flipFavoriteSystem,
	hardDeleteSystem,
	isFavoriteSystem,
	listFavoriteSystemById,
	listFavoriteSystems,
	listSoftDeletedSystems,
	listSystemById,
	listSystems,
	restoreSystem,
	softDeleteSystem,
	updateOnlySystemImage,
	updateSystem,
} from "@/features/Systems/system.repo"
import { PrismaErrorHandler } from "@/helpers/prisma"
import type { Prisma } from "@prisma/client"
import { getPrismaPagination } from "@/helpers/prisma/getPrismaPagination.helper"
import { deleteFile, uploadFile } from "@/features/Storage/storage.service"
import { withResolvedImages, withResolvedImage } from "@/helpers/shared/storagePresenter.helper"

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

export async function createCompanySystem(
	creator: CreatorIdentifier,
	data: CreateSystemInput,
	file: Express.Multer.File | null
) {
	const ctx = await getUserAccessContext(creator)

	return systemErrors.exec(async () => {
		const created = await createSystem(ctx.userId, data, null)

		let imageKey: string | null = null
		if (file) {
			try {
				imageKey = await uploadFile(file, "systems")
			} catch (uploadErr) {
				await hardDeleteSystem(created.id)
				throw uploadErr
			}
		}

		if (imageKey) {
			await updateOnlySystemImage(created.id, imageKey)
		}
		return created
	})
}

export async function createManyCompanySystems(creator: CreatorIdentifier, data: CreateManySystemInput) {
	const ctx = await getUserAccessContext(creator)
	return systemErrors.exec(() => createManySystem(ctx.userId, data))
}
export async function updateCompanySystem(
	system: SystemIdentifier,
	data: UpdateSystemInput,
	file: Express.Multer.File | null
) {
	const existing = await listSystemById(system.id)

	return systemErrors.exec(async () => {
		const updated = await updateSystem(system.id, data, null)

		let imageKey: string | undefined = undefined

		if (file) {
			// Upload image first
			imageKey = await uploadFile(file, "systems")
			// Then delete the old one
			await deleteFile(existing.image)
		}

		if (imageKey) {
			await updateOnlySystemImage(updated.id, imageKey)
		}

		return updated
	})
}

export async function toggleFavoriteSystem(user: CreatorIdentifier, system: SystemIdentifier) {
	return systemErrors.exec(() => flipFavoriteSystem(user.id, system.id))
}

export async function checkIfSystemIsFavorite(user: CreatorIdentifier, system: SystemIdentifier) {
	return systemErrors.exec(() => isFavoriteSystem(user.id, system.id))
}

export async function restoreCompanySystem(system: SystemIdentifier) {
	return systemErrors.exec(async () => {
		const _system = await restoreSystem(system.id)
		return {
			restored: await withResolvedImage(_system),
		}
	})
}

export async function softDeleteCompanySystem(system: SystemIdentifier) {
	return systemErrors.exec(() => softDeleteSystem(system.id))
}

export async function hardDeleteCompanySystem(system: SystemIdentifier) {
	const existing = await listSystemById(system.id)

	return systemErrors.exec(async () => {
		const deleted = await hardDeleteSystem(existing.id)
		await deleteFile(deleted.image)
	})
}

export async function getCompanySystems(query: SystemQueryInput, departmentId: string | null) {
	const options = getPrismaPagination(query)

	// Department scoping — separate from search
	const departmentFilter: Prisma.SystemWhereInput = departmentId
		? {
				OR: [
					{ departmentMap: { none: {} } }, // public systems
					{ departmentMap: { some: { departmentId } } }, // employee's department
				],
			}
		: {} // admin — no filter

	const where: Prisma.SystemWhereInput = {
		...departmentFilter,
		systemFlag: { name: query.status },
		...(query.search && {
			OR: [
				{ name: { contains: query.search, mode: "insensitive" } },
				{ url: { contains: query.search, mode: "insensitive" } },
			],
		}),
	}

	return systemErrors.exec(async () => {
		const { systems, total } = await listSystems(where, options)
		return { total, systems: await withResolvedImages(systems) }
	})
}

export async function getFavoriteSystems(creator: CreatorIdentifier, query: SystemQueryInput) {
	const options = getPrismaPagination(query)

	const where: Prisma.UserFavoriteSystemWhereInput = {
		userId: creator.id,

		system: {
			systemFlag: {
				name: query.status,
			},
		},
		...(query.search && {
			OR: [
				{ system: { name: { contains: query.search, mode: "insensitive" } } },
				{ system: { url: { contains: query.search, mode: "insensitive" } } },
			],
		}),
	}
	return systemErrors.exec(async () => {
		const { favoriteSystems, total } = await listFavoriteSystems(where, options)
		return {
			favorites: await withResolvedImages(favoriteSystems),
			total,
		}
	})
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

	return systemErrors.exec(async () => {
		const { systems, total } = await listSoftDeletedSystems(where, options)
		return {
			deleted: await withResolvedImages(systems),
			total,
		}
	})
}

export async function getCompanySystemById(system: SystemIdentifier) {
	return systemErrors.exec(async () => {
		const _system = await listSystemById(system.id)

		return {
			system: await withResolvedImage(_system),
		}
	})
}

export async function getFavoriteCompanySystemById(user: CreatorIdentifier, system: SystemIdentifier) {
	return systemErrors.exec(async () => {
		const _system = await listFavoriteSystemById(user.id, system.id)

		return {
			favorite: await withResolvedImage(_system),
		}
	})
}
