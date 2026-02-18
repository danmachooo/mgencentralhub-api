import type { CreateDepartmentInput, DepartmentIdentifier, UpdateDepartmentInput } from "@/schema"
import { createDepartment, updateDepartment } from "@/features/Departments/repos/department.repo"

export async function createCompanyDepartment(data: CreateDepartmentInput) {
	return await createDepartment(data)
}

export async function updateCompanyDepartment(department: DepartmentIdentifier, data: UpdateDepartmentInput) {
	const { id } = department

	return await updateDepartment(id, data)
}
