import {
	createManySystemFlagHandler,
	createSystemFlagHandler,
	hardDeleteSystemFlagHandler,
	restoreSystemFlagHandler,
	softDeleteSystemFlagHandler,
	updateSystemFlagHandler,
} from "@/features/Systems/SystemFlags/flag.controller"
import {
	getActiveSystemFlagById,
	getActiveSystemFlags,
	getInactiveSystemFlags,
} from "@/features/Systems/SystemFlags/flag.service"
import { requireRole } from "@/middlewares"
import { Router } from "express"

const router = Router()

// GET
router.get("/", requireRole("ADMIN", "EMPLOYEE"), getActiveSystemFlags)
router.get("/inactive", requireRole("ADMIN"), getInactiveSystemFlags)
router.get("/:id", requireRole("ADMIN", "EMPLOYEE"), getActiveSystemFlagById)

// POST
router.post("/", requireRole("ADMIN"), createSystemFlagHandler)
router.post("/bulk", requireRole("ADMIN"), createManySystemFlagHandler)

// PATCH
router.patch("/:id", requireRole("ADMIN"), updateSystemFlagHandler)
router.patch("/:id/restore", requireRole("ADMIN"), restoreSystemFlagHandler)

// DELETE
router.delete("/:id", requireRole("ADMIN"), softDeleteSystemFlagHandler)
router.delete("/:id/hard", requireRole("ADMIN"), hardDeleteSystemFlagHandler)

export default router
