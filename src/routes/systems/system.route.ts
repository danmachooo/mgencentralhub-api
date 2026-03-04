import {
	createManyCompanySystemsHandler,
	createCompanySystemHandler,
	getCompanySystemByIdHandler,
	getCompanySystemsHandler,
	getDeletedCompanySystemsHandler,
	hardDeleteCompanySystemHandler,
	restoreCompanySystemHandler,
	softDeleteCompanySystemHandler,
	updateCompanySystemHandler,
} from "@/features/systems/system.controller"
import { Router } from "express"
import { requireRole } from "@/middlewares/rbac.middleware"
import { uploadMiddleware } from "@/middlewares/upload.middleware"
import FavoriteRouter from "@/routes/systems/company-favorite.route"
import PersonalSystemRouter from "@/routes/systems/personal.route"
import SystemFlagRouter from "@/routes/systems/flag.routes"

const router = Router()

// GET
router.get("/", requireRole("ADMIN", "EMPLOYEE"), getCompanySystemsHandler)
router.get("/deleted", requireRole("ADMIN"), getDeletedCompanySystemsHandler)

router.use("/personal", requireRole("ADMIN", "EMPLOYEE"), PersonalSystemRouter)
router.use("/favorites", requireRole("ADMIN", "EMPLOYEE"), FavoriteRouter)
router.use("/flags", requireRole("ADMIN", "EMPLOYEE"), SystemFlagRouter)

// POST
router.post("/", requireRole("ADMIN"), uploadMiddleware.single("image"), createCompanySystemHandler)
router.post("/bulk", requireRole("ADMIN"), createManyCompanySystemsHandler)

// PATCH
router.patch("/:id", requireRole("ADMIN"), uploadMiddleware.single("image"), updateCompanySystemHandler)
router.patch("/:id/restore", requireRole("ADMIN"), restoreCompanySystemHandler)

//DELETE
router.delete("/:id", requireRole("ADMIN"), softDeleteCompanySystemHandler)
router.delete("/:id/hard", requireRole("ADMIN"), hardDeleteCompanySystemHandler)

router.get("/:id", requireRole("ADMIN", "EMPLOYEE"), getCompanySystemByIdHandler)

export default router
