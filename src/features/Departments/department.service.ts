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
import {
	invalidateDepartmentCache,
	invalidateDepartmentCollectionCaches,
	withDepartmentByIdCache,
	withDepartmentListCache,
	withInactiveDepartmentListCache,
} from "@/helpers/shared/cache/department-cache.helper"

const departmentErrors = new PrismaErrorHandler({
	entity: "Department",
})

export async function createCompanyDepartment(data: CreateDepartmentInput) {
	return departmentErrors.exec(async () => {
		const created = await createDepartment(data)
		await invalidateDepartmentCollectionCaches()
		return created
	})
}

export async function createManyCompanyDepartment(data: CreateManyDepartmentInput) {
	return departmentErrors.exec(async () => {
		const created = await createManyDepartments(data)
		await invalidateDepartmentCollectionCaches()
		return created
	})
}

export async function updateCompanyDepartment(department: DepartmentIdentifier, data: UpdateDepartmentInput) {
	const { id } = department

	return departmentErrors.exec(async () => {
		const updated = await updateDepartment(id, data)
		await invalidateDepartmentCache(id)
		return updated
	})
}

export async function restoreCompanyDepartment(department: DepartmentIdentifier) {
	const { id } = department

	return departmentErrors.exec(async () => {
		const restored = await restoreDepartment(id)
		await invalidateDepartmentCache(id)
		return restored
	})
}

export async function softDeleteCompanyDepartment(department: DepartmentIdentifier) {
	const { id } = department

	return departmentErrors.exec(async () => {
		const deleted = await softDeleteDepartment(id)
		await invalidateDepartmentCache(id)
		return deleted
	})
}

export async function hardDeleteCompanyDepartment(department: DepartmentIdentifier) {
	const { id } = department

	return departmentErrors.exec(async () => {
		const deleted = await hardDeleteDepartment(id)
		await invalidateDepartmentCache(id)
		return deleted
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

	return withDepartmentListCache(query, () => departmentErrors.exec(() => listDepartments(where, options)))
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

	return withInactiveDepartmentListCache(query, () =>
		departmentErrors.exec(() => listSoftDeletedDepartments(where, options))
	)
}

export async function getCompanyDepartmentbyId(department: DepartmentIdentifier) {
	const { id } = department

	return withDepartmentByIdCache(id, () => departmentErrors.exec(() => listDepartmentById(id)))
}
