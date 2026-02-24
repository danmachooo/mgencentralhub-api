import { prisma } from "@/lib/prisma"
import type { CreateDepartmentInput, CreateManyDepartmentInput, UpdateDepartmentInput } from "@/schema"
import type { PrismaQueryOptions } from "@/types/shared/prismaOption.types"
import type { Prisma } from "@prisma/client"

const ACTIVE_ONLY: Prisma.DepartmentWhereInput = {
	deletedAt: null,
}

const DELETED_ONLY: Prisma.DepartmentWhereInput = {
	NOT: {
		deletedAt: null,
	},
}

const DEPARTMENT_SHAPE: Prisma.DepartmentSelect = {
	id: true,
	name: true,
	description: true,
	createdAt: true,
}

export async function createDepartment(data: CreateDepartmentInput) {
	return await prisma.department.create({
		data: {
			name: data.name,
			description: data.description,
		},
		select: {
			id: true,
			createdAt: true,
		},
	})
}

export async function createManyDepartments(data: CreateManyDepartmentInput) {
	return await prisma.department.createManyAndReturn({
		data,
		select: {
			id: true,
			createdAt: true,
		},
		skipDuplicates: true,
	})
}

export async function updateDepartment(id: string, data: UpdateDepartmentInput) {
	return await prisma.department.update({
		where: {
			id,
		},
		data: {
			name: data.name,
			description: data.description,
		},
		select: {
			id: true,
			updatedAt: true,
		},
	})
}

export async function restoreDepartment(id: string) {
	return await prisma.department.findUniqueOrThrow({
		where: {
			id,
		},
		select: DEPARTMENT_SHAPE,
	})
}

export async function softDeleteDepartment(id: string) {
	return await prisma.department.update({
		where: {
			id,
			deletedAt: null,
		},
		data: {
			deletedAt: new Date(),
		},
	})
}

export async function hardDeleteDepartment(id: string) {
	return await prisma.department.delete({
		where: {
			id,
		},
	})
}

export async function listDepartments(where: Prisma.DepartmentWhereInput, options: PrismaQueryOptions) {
	const finalWhere = {
		...ACTIVE_ONLY,
		...where,
	}

	const [departments, total] = await Promise.all([
		prisma.department.findMany({
			where: finalWhere,
			...options,
			select: DEPARTMENT_SHAPE,
		}),
		prisma.department.count({
			where: finalWhere,
			...options,
		}),
	])

	return {
		departments,
		total,
	}
}

export async function listDepartmentById(id: string) {
	return await prisma.department.findUniqueOrThrow({
		where: {
			id,
		},
		select: DEPARTMENT_SHAPE,
	})
}

export async function listSoftDeletedDepartments(where: Prisma.DepartmentWhereInput, options: PrismaQueryOptions) {
	const finalWhere = {
		...DELETED_ONLY,
		...where,
	}

	const [departments, total] = await Promise.all([
		prisma.department.findMany({
			where: finalWhere,
			...options,
			select: DEPARTMENT_SHAPE,
		}),
		prisma.department.count({
			where: finalWhere,
			...options,
		}),
	])

	return {
		departments,
		total,
	}
}
