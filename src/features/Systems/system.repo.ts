import { prisma } from "@/lib/prisma"
import type { CreateManySystemInput, CreateSystemInput, UpdateSystemInput } from "@/schema"
import type { PrismaQueryOptions } from "@/types/shared/prismaOption.types"
import type { Prisma } from "@prisma/client"

const ACTIVE_ONLY: Prisma.SystemWhereInput = {
	deletedAt: null,
}

const DELETED_ONLY: Prisma.SystemWhereInput = {
	NOT: {
		deletedAt: null,
	}
}

const SYSTEM_SHAPE: Prisma.SystemSelect = {
	id: true,
	name: true,
	description: true,
	systemFlag: {
		select: {
			id: true,
			name: true,
			description: true,
		},
	},
	url: true,
	image: true,
	createdAt: true,
	updatedAt: true,
	departmentMap: {
		select: {
			departmentId: true,
		},
	},
}

export async function createSystem(id: string, data: CreateSystemInput, imageKey: string | null) {
	const departmentIds = [...new Set(data.departmentIds)]

	return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
		const systemCreated = await tx.system.create({
			data: {
				name: data.name,
				description: data.description,
				url: data.url,
				image: imageKey,
				statusId: data.statusId,
				creatorId: id,
				departmentMap: {
					create: departmentIds.map(departmentId => ({ departmentId })),
				},
			},
			select: {
				id: true,
				createdAt: true,
			},
		})
		return systemCreated
	})
}

export async function createManySystem(id: string, systemsData: CreateManySystemInput) {
	return prisma.$transaction(async tx => {
		//  Bulk insert all Systems

		await tx.system.createMany({
			data: systemsData.map(s => ({
				name: s.name,
				description: s.description,
				url: s.url,
				statusId: s.statusId,
				creatorId: id,
			})),
			skipDuplicates: true,
		})

		// Fetch the newly created systems to get their IDs
		const names = systemsData.map(s => s.name)
		const createdSystems = await tx.system.findMany({
			where: { name: { in: names }, creatorId: id },
			select: { id: true, name: true },
		})

		// Map the retrieved IDs back to their corresponding department IDs
		const departmentMappings = systemsData.flatMap(systemInput => {
			const dbSystem = createdSystems.find(s => s.name === systemInput.name)
			if (!dbSystem) return []

			const uniqueDeps = [...new Set(systemInput.departmentIds)]
			return uniqueDeps.map(depId => ({
				systemId: dbSystem.id,
				departmentId: depId,
			}))
		})

		// One final bulk insert for all relationships
		await tx.systemDepartmentMap.createMany({
			data: departmentMappings,
		})

		return createdSystems
	})
}

export async function updateSystem(id: string, data: UpdateSystemInput, imageKey?: string | null) {
	const departmentIds = data.departmentIds ? [...new Set(data.departmentIds)] : undefined

	return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
		const systemUpdated = await tx.system.update({
			where: {
				id: id,
			},
			data: {
				name: data.name,
				description: data.description,
				url: data.url,
				statusId: data.statusId,
				...(imageKey !== undefined && { image: imageKey }), // Update image if a new one is upload
			},
			select: {
				id: true,
				updatedAt: true,
			},
		})

		if (departmentIds) {
			await tx.systemDepartmentMap.deleteMany({
				where: {
					systemId: id,
				},
			})

			if (departmentIds.length > 0) {
				await tx.systemDepartmentMap.createMany({
					data: departmentIds.map(departmentId => ({
						systemId: id,
						departmentId,
					})),
					skipDuplicates: true,
				})
			}
		}

		return systemUpdated
	})
}

export async function updateOnlySystemImage(id: string, imageKey: string) {
	return await prisma.system.update({
		where: {
			id,
		},
		data: {
			image: imageKey,
		},
	})
}

export async function restoreSystem(id: string) {
	return await prisma.system.update({
		where: {
			id,
			NOT: { deletedAt: null },
		},
		data: {
			deletedAt: null,
		},
		select: SYSTEM_SHAPE,
	})
}

export async function flipFavoriteSystem(userId: string, systemId: string) {
	const compositeKey = {
		userId,
		systemId,
	}
	const existing = await prisma.userFavoriteSystem.findUnique({
		where: {
			userId_systemId: compositeKey,
		},
	})

	if (existing) {
		await prisma.userFavoriteSystem.delete({
			where: {
				userId_systemId: compositeKey,
			},
		})
		return { favorited: false }
	}

	await prisma.userFavoriteSystem.create({
		data: compositeKey,
	})

	return {
		favorited: true,
	}
}

export async function isFavoriteSystem(userId: string, systemId: string) {
	const compositeKey = {
		userId,
		systemId,
	}
	const fav = await prisma.userFavoriteSystem.findUniqueOrThrow({
		where: {
			userId_systemId: compositeKey,
		},
		select: {
			userId: true,
		},
	})
	return !!fav
}

export async function softDeleteSystem(id: string) {
	return await prisma.system.update({
		where: {
			id,
			deletedAt: null,
		},
		data: {
			deletedAt: new Date(),
		},
	})
}

export async function hardDeleteSystem(id: string) {
	return await prisma.system.delete({
		where: { id },
		select: {
			image: true,
		},
	})
}

export async function listSystemById(id: string) {
	const system = await prisma.system.findUniqueOrThrow({
		where: {
			id,
		},
		select: SYSTEM_SHAPE,
	})

	return system
}

export async function listFavoriteSystemById(userId: string, systemId: string) {
	const compositeKey = {
		userId,
		systemId,
	}
	const favorite = await prisma.userFavoriteSystem.findUniqueOrThrow({
		where: {
			userId_systemId: compositeKey,
		},
		select: SYSTEM_SHAPE,
	})

	return favorite
}

export async function listSystems(where: Prisma.SystemWhereInput, options: PrismaQueryOptions) {
	const finalWhereQuery: Prisma.SystemWhereInput = {
		...where,
		...ACTIVE_ONLY,
	}

	const [systems, total] = await Promise.all([
		prisma.system.findMany({
			where: finalWhereQuery,
			...options,

			select: SYSTEM_SHAPE,
		}),
		prisma.system.count({
			where: finalWhereQuery,
		}),
	])

	return { systems, total }
}

export async function listSoftDeletedSystems(where: Prisma.SystemWhereInput, options: PrismaQueryOptions) {
	const finalWhere: Prisma.SystemWhereInput = {
		...where,
		...DELETED_ONLY,
	}

	const [systems, total] = await Promise.all([
		prisma.system.findMany({
			where: finalWhere,
			...options,
			select: SYSTEM_SHAPE,
		}),

		prisma.system.count({
			where: finalWhere,
		}),
	])

	return {
		systems,
		total,
	}
}

export async function listFavoriteSystems(where: Prisma.UserFavoriteSystemWhereInput, options: PrismaQueryOptions) {
	const finalWhere: Prisma.UserFavoriteSystemWhereInput = {
		...where,
		system: {
			...ACTIVE_ONLY,
		},
	}

	const [favoriteSystems, total] = await Promise.all([
		prisma.userFavoriteSystem.findMany({
			where: finalWhere,
			...options,
			select: SYSTEM_SHAPE,
		}),

		prisma.userFavoriteSystem.count({
			where: finalWhere,
		}),
	])

	return {
		favoriteSystems,
		total,
	}
}
