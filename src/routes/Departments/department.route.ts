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

router.get("/", getCompanyDepartmentsHandler)
router.get("/", getSoftDeletedCompanyDepartmentsHandler)
router.get("/:id", getCompanyDepartmentbyIdHandler)

router.post("/", createCompanyDepartmentHandler)
router.post("/", createManyCompanyDepartmentHandler)

router.patch("/", restoreCompanyDepartmentHandler)
router.patch("/:id", updateDepartmentHandler)

router.delete("/", softDeleteCompanyDepartmentHandler)
router.delete("/", hardDeleteCompanyDepartmentHandler)

export default router
