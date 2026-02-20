import type { CreateDepartmentInput, DepartmentIdentifier, DepartmentQueryInput, UpdateDepartmentInput } from "@/schema"
import {
	createDepartment,
	getDepartmentByID,
	getDepartments,
	updateDepartment,
} from "@/features/Departments/repos/department.repo"
import { getPrismaPagination, withPrismaErrorHandling } from "@/helpers/prisma"
import type{ Prisma } from "@prisma/client"

export async function createCompanyDepartment(data: CreateDepartmentInput) {
	return withPrismaErrorHandling(() => createDepartment(data), {
		entity: "Department",
	})
}

export async function updateCompanyDepartment(department: DepartmentIdentifier, data: UpdateDepartmentInput) {
	const { id } = department

	return withPrismaErrorHandling(() => updateDepartment(id, data), {
		entity: "Department",
	})
}

export async function getCompanyDepartments(query: DepartmentQueryInput) {
	const options = getPrismaPagination(query)
	const where: Prisma.DepartmentWhereInput = {
		...(query.name && { name: { contains: query.name, mode: "insensitive" } }),

		...(query.search && {
			OR: [
				{ name: { contains: query.search, mode: "insensitive" } },
				{ description: { contains: query.search, mode: "insensitive" } },
			],
		}),
	}

	return withPrismaErrorHandling(() => getDepartments(where, options), {
		entity: "Department",
	})
}

export async function getCompanyDepartmentbyID(department: DepartmentIdentifier) {
	const { id } = department

	return withPrismaErrorHandling(() => getDepartmentByID(id), {
		entity: "Department",
	})
}
