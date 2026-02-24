import { asyncHandler } from "@/middlewares"
import { createDepartmentSchema, createManyDepartmentSchema, updateDepartmentSchema } from "@/schema"
import {
	createCompanyDepartment,
	createManyCompanyDepartment,
	getCompanyDepartmentbyId,
	getCompanyDepartments,
	getInactiveDepartments,
	hardDeleteCompanyDepartment,
	restoreCompanyDepartment,
	softDeleteCompanyDepartment,
	updateCompanyDepartment,
} from "@/features/Departments/department.service"
import { departmentIdentifierSchema } from "@/schema/Departments/departmentIdentifier.schema"
import type { HttpContext } from "@/types/shared"
import { departmentQuerySchema } from "@/schema/Departments/departmentQuery.schema"
import { sendPaginatedResponse } from "@/helpers/shared"

export const createCompanyDepartmentHandler = asyncHandler(async (http: HttpContext) => {
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

export const createManyCompanyDepartmentHandler = asyncHandler(async (http: HttpContext) => {
	const body = createManyDepartmentSchema.parse(http.req.body)

	const createdDepartments = await createManyCompanyDepartment(body)

	return http.res.status(201).json({
		success: true,
		message: "Department has been created.",
		data: {
			createdDepartments,
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

export const restoreCompanyDepartmentHandler = asyncHandler(async (http: HttpContext) => {
	const department = departmentIdentifierSchema.parse(http.req.params)

	await restoreCompanyDepartment(department)

	return http.res.status(404).json({
		success: true,
		message: "Department has been deleted",
	})
})

export const softDeleteCompanyDepartmentHandler = asyncHandler(async (http: HttpContext) => {
	const department = departmentIdentifierSchema.parse(http.req.params)

	await softDeleteCompanyDepartment(department)

	return http.res.status(404).json({
		success: true,
		message: "Department has been deleted",
	})
})

export const hardDeleteCompanyDepartmentHandler = asyncHandler(async (http: HttpContext) => {
	const department = departmentIdentifierSchema.parse(http.req.params)

	await hardDeleteCompanyDepartment(department)

	return http.res.status(410).json({
		success: true,
		message: "Department has been deleted",
	})
})

export const getCompanyDepartmentsHandler = asyncHandler(async (http: HttpContext) => {
	const query = departmentQuerySchema.parse(http.req.query)

	const { departments, total } = await getCompanyDepartments(query)

	return sendPaginatedResponse(http, { data: departments, total }, query, "Departments retrieved successfully")
})

export const getSoftDeletedCompanyDepartmentsHandler = asyncHandler(async (http: HttpContext) => {
	const query = departmentQuerySchema.parse(http.req.query)

	const { departments, total } = await getInactiveDepartments(query)

	return sendPaginatedResponse(http, { data: departments, total }, query, "Departments retrieved successfully")
})

export const getCompanyDepartmentbyIdHandler = asyncHandler(async (http: HttpContext) => {
	const { id } = departmentIdentifierSchema.parse(http.req.params)

	const department = await getCompanyDepartmentbyId({ id })

	return http.res.status(200).json({
		success: true,
		message: "Department has been retrieved.",
		data: {
			department,
		},
	})
})
