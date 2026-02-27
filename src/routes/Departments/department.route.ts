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
import { requireRole } from "@/middlewares"
import { Router } from "express"

const router = Router()

// GET
router.get("/", requireRole("ADMIN", "EMPLOYEE"), getCompanyDepartmentsHandler)
router.get("/deleted", requireRole("ADMIN"), getSoftDeletedCompanyDepartmentsHandler)
router.get("/:id", requireRole("ADMIN", "EMPLOYEE"), getCompanyDepartmentbyIdHandler)

// POST
router.post("/", requireRole("ADMIN"), createCompanyDepartmentHandler)
router.post("/bulk", requireRole("ADMIN"), createManyCompanyDepartmentHandler)

// PATCH
router.patch("/:id", requireRole("ADMIN"), updateDepartmentHandler)
router.patch("/:id/restore", requireRole("ADMIN"), restoreCompanyDepartmentHandler)

// DELETE
router.delete("/:id", requireRole("ADMIN"), softDeleteCompanyDepartmentHandler)
router.delete("/:id/hard", requireRole("ADMIN"), hardDeleteCompanyDepartmentHandler)

export default router
