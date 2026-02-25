import { prisma } from "@/lib/prisma"
import type { CreateManyPersonalSystemInput, CreatePersonalSystemInput, UpdatePersonalSystemInput } from "@/schema"
import type { PrismaQueryOptions } from "@/types/shared/prismaOption.types"
import type { Prisma } from "@prisma/client"

const ACTIVE_ONLY: Prisma.PersonalSystemWhereInput = {
	deletedAt: null,
}

const DELETED_ONLY: Prisma.PersonalSystemWhereInput = {
	deletedAt: null,
}

const SYSTEM_SHAPE: Prisma.PersonalSystemSelect = {
	id: true,
	ownerUserId: true,
	owner: {
		select: {
			name: true,
		},
	},
	name: true,
	description: true,
	url: true,
	createdAt: true,
	updatedAt: true,
}

export async function createPersonalSystem(id: string, data: CreatePersonalSystemInput) {
	return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
		const personalSystemCreated = await tx.personalSystem.create({
			data: {
				name: data.name,
				description: data.description,
				url: data.url,
				image: data.image,
				ownerUserId: id,
			},
			select: {
				id: true,
				createdAt: true,
			},
		})
		return personalSystemCreated
	})
}

export async function createManyPersonalSystem(id: string, systemsData: CreateManyPersonalSystemInput) {
	return prisma.$transaction(async tx => {
		await tx.personalSystem.createMany({
			data: systemsData.map(s => ({
				name: s.name,
				description: s.description,
				url: s.url,
				image: s.image,
				ownerUserId: id,
			})),
			skipDuplicates: true,
		})
	})
}

export async function updatePersonalSystem(id: string, data: UpdatePersonalSystemInput) {
	return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
		const systemUpdated = await tx.personalSystem.update({
			where: {
				id: id,
			},
			data: {
				name: data.name,
				description: data.description,
				url: data.url,
				image: data.image,
			},
			select: {
				id: true,
				updatedAt: true,
			},
		})

		return systemUpdated
	})
}

export async function flipFavoritePersonalSystem(userId: string, personalSystemId: string) {
	const compositeKey = {
		userId,
		personalSystemId,
	}
	const existing = await prisma.userFavoritePersonalSystem.findUnique({
		where: {
			userId_personalSystemId: compositeKey,
		},
	})

	if (existing) {
		await prisma.userFavoritePersonalSystem.delete({
			where: {
				userId_personalSystemId: compositeKey,
			},
		})
		return { favorited: false }
	}

	await prisma.userFavoritePersonalSystem.create({
		data: compositeKey,
	})

	return {
		favorited: true,
	}
}

export async function restorePersonalSystem(id: string) {
	return await prisma.personalSystem.update({
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

export async function softDeletePersonalSystem(id: string) {
	return await prisma.personalSystem.update({
		where: {
			id,
			deletedAt: null,
		},
		data: {
			deletedAt: new Date(),
		},
	})
}

export async function hardDeletePersonalSystem(id: string) {
	return await prisma.personalSystem.delete({
		where: { id },
	})
}

export async function listPersonalSystemById(id: string) {
	const personalSystem = await prisma.personalSystem.findUniqueOrThrow({
		where: {
			id,
		},
		select: SYSTEM_SHAPE,
	})

	return personalSystem
}

export async function listPersonalSystems(where: Prisma.PersonalSystemWhereInput, options: PrismaQueryOptions) {
	const finalWhereQuery: Prisma.PersonalSystemWhereInput = {
		...where,
		...ACTIVE_ONLY,
	}

	const [systems, total] = await Promise.all([
		prisma.personalSystem.findMany({
			where: finalWhereQuery,
			...options,

			select: SYSTEM_SHAPE,
		}),
		prisma.personalSystem.count({
			where: finalWhereQuery,
			...options,
		}),
	])

	return { systems, total }
}

export async function listFavoritePersonalSystems(
	where: Prisma.UserFavoritePersonalSystemWhereInput,
	options: PrismaQueryOptions
) {
	const finalWhereQuery: Prisma.UserFavoritePersonalSystemWhereInput = {
		...where,
		personalSystem: DELETED_ONLY,
	}

	const [favoriteSystems, total] = await Promise.all([
		prisma.userFavoritePersonalSystem.findMany({
			where: finalWhereQuery,
			...options,

			select: SYSTEM_SHAPE,
		}),
		prisma.userFavoritePersonalSystem.count({
			where: finalWhereQuery,
			...options,
		}),
	])

	return { favoriteSystems, total }
}

export async function listFavoritePersonalSystemById(userId: string, personalSystemId: string) {
	const compositeKey = {
		userId,
		personalSystemId,
	}
	const favorite = await prisma.userFavoritePersonalSystem.findUniqueOrThrow({
		where: {
			userId_personalSystemId: compositeKey,
		},
		select: SYSTEM_SHAPE,
	})

	return favorite
}

export async function listSoftDeletedPersonaSystems(
	where: Prisma.PersonalSystemWhereInput,
	options: PrismaQueryOptions
) {
	const finalWhere: Prisma.PersonalSystemWhereInput = {
		...where,
		...DELETED_ONLY,
	}

	const [systems, total] = await Promise.all([
		prisma.personalSystem.findMany({
			where: finalWhere,
			select: SYSTEM_SHAPE,
		}),

		prisma.personalSystem.count({
			where: finalWhere,
			...options,
		}),
	])

	return {
		systems,
		total,
	}
}
