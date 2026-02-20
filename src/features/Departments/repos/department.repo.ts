import { prisma } from "@/lib/prisma"
import type { CreateDepartmentInput, UpdateDepartmentInput } from "@/schema"
import type { PrismaQueryOptions } from "@/types/shared/prismaOption.types"
import type { Prisma } from "@prisma/client"

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

export async function getDepartments(where: Prisma.DepartmentWhereInput, options: PrismaQueryOptions) {
	const [departments, total] = await Promise.all([
		prisma.department.findMany({
			where,
			...options,
			select: {
				id: true,
				name: true,
				description: true,
				createdAt: true,
			},
		}),
		prisma.department.count({
			where,
		}),
	])

	return {
		departments,
		total,
	}
}

export async function getDepartmentByID(id: string) {
	return await prisma.department.findUniqueOrThrow({
		where: {
			id,
		},
		select: {
			id: true,
			name: true,
			description: true,
			createdAt: true,
		},
	})
}
