import { prisma } from "@/lib/prisma"
import type { CreateManyPersonalSystemInput, CreatePersonalSystemInput, UpdatePersonalSystemInput } from "@/schema"
import type { PrismaQueryOptions } from "@/types/shared/prismaOption.types"
import type { Prisma } from "@prisma/client"

const ACTIVE_ONLY: Prisma.PersonalSystemWhereInput = {
	deletedAt: null,
}

const DELETED_ONLY: Prisma.PersonalSystemWhereInput = {
	NOT: {
		deletedAt: null,
	},
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

export async function createPersonalSystem(
	creatorId: string,
	data: CreatePersonalSystemInput,
	imageKey: string | null
) {
	return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
		const personalSystemCreated = await tx.personalSystem.create({
			data: {
				name: data.name,
				description: data.description,
				url: data.url,
				image: imageKey,
				ownerUserId: creatorId,
			},
			select: {
				id: true,
				createdAt: true,
			},
		})
		return personalSystemCreated
	})
}

export async function createManyPersonalSystem(creatorId: string, systemsData: CreateManyPersonalSystemInput) {
	return prisma.$transaction(async tx => {
		await tx.personalSystem.createMany({
			data: systemsData.map(s => ({
				name: s.name,
				description: s.description,
				url: s.url,
				image: s.image,
				ownerUserId: creatorId,
			})),
			skipDuplicates: true,
		})
	})
}

export async function updatePersonalSystem(
	systemId: string,
	creatorId: string,
	data: UpdatePersonalSystemInput,
	imageKey?: string | null
) {
	return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
		const systemUpdated = await tx.personalSystem.update({
			where: {
				id: systemId,
				ownerUserId: creatorId,
			},
			data: {
				name: data.name,
				description: data.description,
				url: data.url,
				...(imageKey !== undefined && { image: imageKey }),
			},
			select: {
				id: true,
				updatedAt: true,
			},
		})

		return systemUpdated
	})
}

export async function updateOnlyPersonalSystemImage(systemId: string, creatorId: string, imageKey: string) {
	return await prisma.personalSystem.update({
		where: {
			id: systemId,
			ownerUserId: creatorId,
		},
		data: {
			image: imageKey,
		},
	})
}

export async function flipFavoritePersonalSystem(creatorId: string, personalSystemId: string) {
	const compositeKey = {
		userId: creatorId,
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

export async function restorePersonalSystem(creatorId: string, systemId: string) {
	return await prisma.personalSystem.update({
		where: {
			id: systemId,
			ownerUserId: creatorId,
			NOT: { deletedAt: null },
		},
		data: {
			deletedAt: null,
		},
		select: SYSTEM_SHAPE,
	})
}

export async function softDeletePersonalSystem(creatorId: string, systemId: string) {
	return await prisma.personalSystem.update({
		where: {
			id: systemId,
			ownerUserId: creatorId,
			deletedAt: null,
		},
		data: {
			deletedAt: new Date(),
		},
	})
}

export async function hardDeletePersonalSystem(creatorId: string, systemId: string) {
	return await prisma.personalSystem.delete({
		where: { id: systemId, ownerUserId: creatorId },
		select: {
			image: true,
		},
	})
}

export async function listPersonalSystemById(creatorId: string, systemId: string) {
	const personalSystem = await prisma.personalSystem.findUniqueOrThrow({
		where: {
			id: systemId,
			ownerUserId: creatorId,
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
		personalSystem: ACTIVE_ONLY,
	}

	const [favoriteSystems, total] = await Promise.all([
		prisma.userFavoritePersonalSystem.findMany({
			where: finalWhereQuery,
			...options,

			select: SYSTEM_SHAPE,
		}),
		prisma.userFavoritePersonalSystem.count({
			where: finalWhereQuery,
		}),
	])

	return { favoriteSystems, total }
}

export async function listFavoritePersonalSystemById(creatorId: string, systemId: string) {
	const compositeKey = {
		userId: creatorId,
		personalSystemId: systemId,
	}
	const favorite = await prisma.userFavoritePersonalSystem.findUniqueOrThrow({
		where: {
			userId_personalSystemId: compositeKey,
		},
		select: SYSTEM_SHAPE,
	})

	return favorite
}

export async function listSoftDeletedPersonalSystems(
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
			...options,
			select: SYSTEM_SHAPE,
		}),

		prisma.personalSystem.count({
			where: finalWhere,
		}),
	])

	return {
		systems,
		total,
	}
}
