import { asyncHandler } from "@/middlewares"
import { createDepartmentSchema, updateDepartmentSchema } from "@/schema"
import {
	createCompanyDepartment,
	getCompanyDepartmentbyID,
	getCompanyDepartments,
	updateCompanyDepartment,
} from "@/features/Departments/services/department.service"
import { departmentIdentifierSchema } from "@/schema/Departments/departmentIdentifier.schema"
import type { HttpContext } from "@/types/shared"

export const createDepartmentHandler = asyncHandler(async (http: HttpContext) => {
	const body = createDepartmentSchema.parse(http.req.body)

	const createdDepartment = await createCompanyDepartment(body)

	return http.res.status(201).json({
		success: true,
		message: "Department has been created.",
		data: {
			id: createdDepartment.id,
		},
	})
})

export const updateDepartmentHandler = asyncHandler(async (http: HttpContext) => {
	const department = departmentIdentifierSchema.parse(http.req.params)
	const body = updateDepartmentSchema.parse(http.req.body)

	const updatedDepartment = await updateCompanyDepartment(department, body)

	return http.res.status(200).json({
		success: true,
		message: "Department has been updated.",
		data: {
			id: updatedDepartment.id,
		},
	})
})

export const getCompanyDepartmentsHandler = asyncHandler(async (http: HttpContext) => {
	const departments = await getCompanyDepartments()

	return http.res.status(200).json({
		success: true,
		message: "Departments has been retrieved.",
		data: {
			departments,
		},
	})
})

export const getCompanyDepartmentbyIDHandler = asyncHandler(async (http: HttpContext) => {
	const _department = departmentIdentifierSchema.parse(http.req.params)

	const department = await getCompanyDepartmentbyID(_department)

	return http.res.status(200).json({
		success: true,
		message: "Department has been retrieved.",
		data: {
			department,
		},
	})
})
