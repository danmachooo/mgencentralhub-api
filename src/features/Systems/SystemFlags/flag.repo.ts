import { prisma } from "@/lib"
import { CreateManySystemFlagInput, CreateSystemFlagInput, UpdateSystemFlagInput } from "@/schema"
import { Prisma } from "@prisma/client"

const ACTIVE_ONLY: Prisma.SystemFlagWhereInput = {
	deletedAt: null,
}

const DELETED_ONLY: Prisma.SystemFlagWhereInput = {
	NOT: {
		deletedAt: null,
	},
}

const SYSTEM_FLAG_SHAPE: Prisma.SystemFlagSelect = {
	id: true,
	name: true,
	description: true,
	createdAt: true,
	updatedAt: true,
}

export async function createSystemFlag(flag: CreateSystemFlagInput) {
	return await prisma.systemFlag.create({
		data: {
			name: flag.name,
			description: flag.description,
		},
		select: {
			id: true,
			createdAt: true,
		},
	})
}

export async function createManySystemFlags(flags: CreateManySystemFlagInput) {
	return await prisma.systemFlag.createManyAndReturn({
		data: flags,
		select: {
			id: true,
			createdAt: true,
		},
		skipDuplicates: true,
	})
}

export async function updateSystemFlag(id: string, flag: UpdateSystemFlagInput) {
	return await prisma.systemFlag.update({
		where: {
			id,
		},
		data: {
			name: flag.name,
			description: flag.description,
		},
		select: {
			id: true,
			updatedAt: true,
		},
	})
}

export async function restoreSystemFlag(id: string) {
	return await prisma.systemFlag.update({
		where: {
			id,
		},
		data: {
			deletedAt: null,
		},
		select: SYSTEM_FLAG_SHAPE,
	})
}

export async function softDeleteSystemFlag(id: string) {
	return await prisma.systemFlag.update({
		where: {
			id,
		},
		data: {
			deletedAt: null,
		},
	})
}

export async function hardDeleteSystemFlag(id: string) {
	return await prisma.systemFlag.delete({
		where: {
			id,
		},
	})
}

export async function listSystemFlagById(id: string) {
	return await prisma.systemFlag.findUniqueOrThrow({
		where: {
			id,
		},
		select: SYSTEM_FLAG_SHAPE,
	})
}

export async function listSystemFlags() {
	const [flags, total] = await Promise.all([
		prisma.systemFlag.findMany({
			where: {
				...ACTIVE_ONLY,
			},
			select: SYSTEM_FLAG_SHAPE,
		}),
		prisma.systemFlag.count({
			where: {
				...ACTIVE_ONLY,
			},
		}),
	])
	return { flags, total }
}

export async function listSoftDeletedSystemFlags() {
	const [flags, total] = await Promise.all([
		prisma.systemFlag.findMany({
			where: {
				...DELETED_ONLY,
			},
			select: SYSTEM_FLAG_SHAPE,
		}),
		prisma.systemFlag.count({
			where: {
				...DELETED_ONLY,
			},
		}),
	])

	return {
		flags,
		total,
	}
}
