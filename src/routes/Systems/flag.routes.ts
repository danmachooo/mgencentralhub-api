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

router.get("/", getActiveSystemFlags)
router.get("/", getInactiveSystemFlags)
router.get("/:id", getActiveSystemFlagById)

router.post("/", createSystemFlagHandler)
router.post("/", createManySystemFlagHandler)

router.patch("/:id", updateSystemFlagHandler)
router.patch("/:id", restoreSystemFlagHandler)

router.delete("/:id", softDeleteSystemFlagHandler)
router.delete("/:id", hardDeleteSystemFlagHandler)
