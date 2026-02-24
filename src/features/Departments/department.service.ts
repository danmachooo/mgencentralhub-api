import type {
	CreateDepartmentInput,
	CreateManyDepartmentInput,
	DepartmentIdentifier,
	DepartmentQueryInput,
	UpdateDepartmentInput,
} from "@/schema"
import {
	createDepartment,
	createManyDepartments,
	hardDeleteDepartment,
	listDepartmentById,
	listDepartments,
	listSoftDeletedDepartments,
	restoreDepartment,
	softDeleteDepartment,
	updateDepartment,
} from "@/features/Departments/department.repo"
import { getPrismaPagination, PrismaErrorHandler } from "@/helpers/prisma"
import type { Prisma } from "@prisma/client"

const departmentErrors = new PrismaErrorHandler({
	entity: "Department",
})

export async function createCompanyDepartment(data: CreateDepartmentInput) {
	return departmentErrors.exec(() => createDepartment(data))
}

export async function createManyCompanyDepartment(data: CreateManyDepartmentInput) {
	return departmentErrors.exec(() => createManyDepartments(data))
}

export async function updateCompanyDepartment(department: DepartmentIdentifier, data: UpdateDepartmentInput) {
	const { id } = department

	return departmentErrors.exec(() => updateDepartment(id, data))
}

export async function restoreCompanyDepartment(department: DepartmentIdentifier) {
	const { id } = department

	return departmentErrors.exec(() => restoreDepartment(id))
}

export async function softDeleteCompanyDepartment(department: DepartmentIdentifier) {
	const { id } = department

	return departmentErrors.exec(() => softDeleteDepartment(id))
}

export async function hardDeleteCompanyDepartment(department: DepartmentIdentifier) {
	const { id } = department

	return departmentErrors.exec(() => hardDeleteDepartment(id))
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

	return departmentErrors.exec(() => listDepartments(where, options))
}

export async function getInactiveDepartments(query: DepartmentQueryInput) {
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

	return departmentErrors.exec(() => listSoftDeletedDepartments(where, options))
}

export async function getCompanyDepartmentbyId(department: DepartmentIdentifier) {
	const { id } = department

	return departmentErrors.exec(() => listDepartmentById(id))
}
