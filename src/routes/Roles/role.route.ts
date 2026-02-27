import {
	createManyUserRoleHandler,
	createUserRoleHandler,
	getActiveUserRoleByIdHandler,
	getActiveUserRolesHandler,
	getInactiveUserRolesHandler,
	hardDeleteUserRoleHandler,
	restoreUserRoleHandler,
	softDeleteUserRoleHandler,
	updateUserRoleHandler,
} from "@/features/Users/Role/role.controller"
import { requireRole } from "@/middlewares"
import { Router } from "express"

const router = Router()

router.use(requireRole("ADMIN", "EMPLOYEE"))

// GET
router.get("/", getActiveUserRolesHandler)
router.get("/inactive", getInactiveUserRolesHandler)
router.get("/:id", getActiveUserRoleByIdHandler)

// POST
router.post("/", createUserRoleHandler)
router.post("/bulk", createManyUserRoleHandler)

// PATCH
router.patch("/:id", updateUserRoleHandler)
router.patch("/:id/restore", restoreUserRoleHandler)

// DELETE
router.delete("/:id", softDeleteUserRoleHandler)
router.delete("/:id/hard", hardDeleteUserRoleHandler)

export default router
