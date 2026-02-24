import { prisma } from "@/lib/prisma"
import type { CreateSystemInput, UpdateSystemInput } from "@/schema"
import type { PrismaQueryOptions } from "@/types/shared/prismaOption.types"
import type { Prisma } from "@prisma/client"

const ACTIVE_ONLY: Prisma.SystemWhereInput = {
	deletedAt: null,
}

const DELETED_ONLY: Prisma.SystemWhereInput = {
	deletedAt: null,
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
	createdAt: true,
	updatedAt: true,
	departmentMap: {
		select: {
			departmentId: true,
		},
	},
}

export async function createSystem(id: string, data: CreateSystemInput) {
	const departmentIds = [...new Set(data.departmentIds)]

	return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
		const systemCreated = await tx.system.create({
			data: {
				name: data.name,
				description: data.description,
				url: data.url,
				image: data.image,
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

export async function updateSystem(id: string, data: UpdateSystemInput) {
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
				image: data.image,
				statusId: data.statusId,
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
			...options,
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
			select: SYSTEM_SHAPE,
		}),

		prisma.system.count({
			where: finalWhere,
			...options,
		}),
	])

	return {
		systems,
		total,
	}
}
