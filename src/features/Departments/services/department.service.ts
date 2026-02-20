import type { CreateDepartmentInput, DepartmentIdentifier, UpdateDepartmentInput } from "@/schema"
import {
	createDepartment,
	getDepartmentByID,
	getDepartments,
	updateDepartment,
} from "@/features/Departments/repos/department.repo"
import { withPrismaErrorHandling } from "@/helpers/prisma"

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

export async function getCompanyDepartments() {
	return await getDepartments()
}

export async function getCompanyDepartmentbyID(department: DepartmentIdentifier) {
	const { id } = department

	return withPrismaErrorHandling(() => getDepartmentByID(id), {
		entity: "Department",
	})
}
