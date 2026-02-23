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

router.get("/", getActiveUserRolesHandler)
router.get("/", getInactiveUserRolesHandler)
router.get("/:id", getActiveUserRoleByIdHandler)

router.post("/", createUserRoleHandler)
router.post("/many", createManyUserRoleHandler)

router.patch("/:id  ", updateUserRoleHandler)
router.patch("/:id", restoreUserRoleHandler)

router.delete("/:id", softDeleteUserRoleHandler)
router.delete("/:id", hardDeleteUserRoleHandler)

export default router
