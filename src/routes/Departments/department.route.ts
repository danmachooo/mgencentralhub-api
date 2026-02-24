import {
	createCompanyDepartmentHandler,
	createManyCompanyDepartmentHandler,
	getCompanyDepartmentbyIdHandler,
	getCompanyDepartmentsHandler,
	getSoftDeletedCompanyDepartmentsHandler,
	hardDeleteCompanyDepartmentHandler,
	restoreCompanyDepartmentHandler,
	softDeleteCompanyDepartmentHandler,
	updateDepartmentHandler,
} from "@/features/Departments/department.controller"
import { Router } from "express"

const router = Router()

// GET
router.get("/", getCompanyDepartmentsHandler)
router.get("/deleted", getSoftDeletedCompanyDepartmentsHandler)
router.get("/:id", getCompanyDepartmentbyIdHandler)

// POST
router.post("/", createCompanyDepartmentHandler)
router.post("/bulk", createManyCompanyDepartmentHandler)

// PATCH
router.patch("/:id", updateDepartmentHandler)
router.patch("/:id/restore", restoreCompanyDepartmentHandler)

// DELETE
router.delete("/:id", softDeleteCompanyDepartmentHandler)
router.delete("/:id/hard", hardDeleteCompanyDepartmentHandler)

export default router
