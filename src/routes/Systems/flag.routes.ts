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
import { Router } from "express"
const router = Router()

// GET
router.get("/", getActiveSystemFlags)
router.get("/inactive", getInactiveSystemFlags)
router.get("/:id", getActiveSystemFlagById)

// POST
router.post("/", createSystemFlagHandler)
router.post("/bulk", createManySystemFlagHandler)

// PATCH
router.patch("/:id", updateSystemFlagHandler)
router.patch("/:id/restore", restoreSystemFlagHandler)

// DELETE
router.delete("/:id", softDeleteSystemFlagHandler)
router.delete("/:id/hard", hardDeleteSystemFlagHandler)

export default router
