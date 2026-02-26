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
import { uploadMiddleware } from "@/middlewares/upload.middleware"
import FavoriteRouter from "@/routes/Systems/personalFavorite.route"
import { Router } from "express"

const router = Router()

// GET
router.get("/", getCompanySystemsHandler)
router.get("/deleted", getDeletedCompanySystems)
router.get("/:id", getCompanySystemByIdHandler)

// POST
router.post("/", uploadMiddleware.single("image"), createCompanySystemHandler)

// PATCH
router.patch("/:id", uploadMiddleware.single("image"), updateCompanySystemHandler)
router.patch("/:id/restore", restoreCompanySystemHandler)

//DELETE
router.delete("/:id", softDeleteCompanySystemHandler)
router.delete("/:id/hard", hardDeleteCompanySystemHandler)
router.use("/favorites", FavoriteRouter)

export default router
