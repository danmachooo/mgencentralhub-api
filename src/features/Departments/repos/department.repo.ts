import { prisma } from "@/lib/prisma"
import type { CreateDepartmentInput, UpdateDepartmentInput } from "@/schema"

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

export async function getDepartments() {
	return await prisma.department.findMany({
		select: {
			id: true,
			name: true,
			description: true,
			createdAt: true,
		},
	})
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
