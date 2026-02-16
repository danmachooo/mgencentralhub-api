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
		},
	})
}
