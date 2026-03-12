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
} from "@/features/departments/department.service"
import { departmentIdentifierSchema } from "@/schema/departments/department-identifier.schema"
import type { HttpContext } from "@/types/shared"
import { departmentQuerySchema } from "@/schema/departments/department-query.schema"
import { sendPaginatedResponse } from "@/helpers/shared"
import { sendResponse } from "@/helpers/shared/send-response.helper"

export const createCompanyDepartmentHandler = asyncHandler(async (http: HttpContext) => {
	const body = createDepartmentSchema.parse(http.req.body)

	const createdDepartment = await createCompanyDepartment(body)

	return sendResponse(http.res, true, 201, "Department has been created.", createdDepartment)
})

export const createManyCompanyDepartmentHandler = asyncHandler(async (http: HttpContext) => {
	const body = createManyDepartmentSchema.parse(http.req.body)

	const createdDepartments = await createManyCompanyDepartment(body)

	return sendResponse(http.res, true, 201, "Departments has been created.", createdDepartments)
})

export const updateDepartmentHandler = asyncHandler(async (http: HttpContext) => {
	const department = departmentIdentifierSchema.parse(http.req.params)
	const body = updateDepartmentSchema.parse(http.req.body)

	const updatedDepartment = await updateCompanyDepartment(department, body)

	return sendResponse(http.res, true, 200, "Department has been updated.", updatedDepartment)
})

export const restoreCompanyDepartmentHandler = asyncHandler(async (http: HttpContext) => {
	const department = departmentIdentifierSchema.parse(http.req.params)

	const restored = await restoreCompanyDepartment(department)

	return sendResponse(http.res, true, 200, "Department has been restored", restored)
})

export const softDeleteCompanyDepartmentHandler = asyncHandler(async (http: HttpContext) => {
	const department = departmentIdentifierSchema.parse(http.req.params)

	const softDeleted = await softDeleteCompanyDepartment(department)

	return sendResponse(http.res, true, 200, "Department has been deleted.", softDeleted)
})

export const hardDeleteCompanyDepartmentHandler = asyncHandler(async (http: HttpContext) => {
	const department = departmentIdentifierSchema.parse(http.req.params)

	const hardDeleted = await hardDeleteCompanyDepartment(department)
	return sendResponse(http.res, true, 200, "Department has been permanently deleted.", hardDeleted)
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
	const _department = departmentIdentifierSchema.parse(http.req.params)

	const department = await getCompanyDepartmentbyId(_department)

	return sendResponse(http.res, true, 200, "Department has been retrieved.", department)
})
