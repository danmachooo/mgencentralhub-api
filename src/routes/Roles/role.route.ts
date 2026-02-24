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
} from "@/features/UserRole/userRole.controller"
import { Router } from "express"

const router = Router()

// GET
router.get("/", getActiveUserRolesHandler)
router.get("/inactive", getInactiveUserRolesHandler)
router.get("/:id", getActiveUserRoleByIdHandler)

// POST
router.post("/", createUserRoleHandler)
router.post("/many", createManyUserRoleHandler)

// PATCH
router.patch("/:id", updateUserRoleHandler)
router.patch("/:id/restore", restoreUserRoleHandler)

// DELETE
router.delete("/:id", softDeleteUserRoleHandler)
router.delete("/:id/hard", hardDeleteUserRoleHandler)

export default router
