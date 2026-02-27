import {
	createCompanySystemHandler,
	getCompanySystemByIdHandler,
	getCompanySystemsHandler,
	hardDeleteCompanySystemHandler,
	restoreCompanySystemHandler,
	softDeleteCompanySystemHandler,
	updateCompanySystemHandler,
} from "@/features/Systems/system.controller"
import { getDeletedCompanySystems } from "@/features/Systems/system.service"
import { requireRole } from "@/middlewares/rbac.middleware"
import { uploadMiddleware } from "@/middlewares/upload.middleware"
import FavoriteRouter from "@/routes/Systems/companyFavorite.route"
import PersonalSystemRouter from "@/routes/Systems/personal.route"
import { Router } from "express"

const router = Router()

// GET
router.get("/", requireRole("ADMIN", "EMPLOYEE"), getCompanySystemsHandler)
router.get("/deleted", requireRole("ADMIN"), getDeletedCompanySystems)
router.get("/:id", requireRole("ADMIN", "EMPLOYEE"), getCompanySystemByIdHandler)

// POST
router.post("/", requireRole("ADMIN"), uploadMiddleware.single("image"), createCompanySystemHandler)

// PATCH
router.patch("/:id", requireRole("ADMIN"), uploadMiddleware.single("image"), updateCompanySystemHandler)
router.patch("/:id/restore", requireRole("ADMIN"), restoreCompanySystemHandler)

//DELETE
router.delete("/:id", requireRole("ADMIN"), softDeleteCompanySystemHandler)
router.delete("/:id/hard", requireRole("ADMIN"), hardDeleteCompanySystemHandler)

router.use("/personal", requireRole("ADMIN", "EMPLOYEE"), PersonalSystemRouter)
router.use("/favorites", requireRole("ADMIN", "EMPLOYEE"), FavoriteRouter)

export default router
