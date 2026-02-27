import {
	createPersonalSystemHandler,
	getDeletedPersonalSystemsHandler,
	getPersonalSystemByIdHandler,
	getPersonalSystemsHandler,
	hardDeletePersonalSystemHandler,
	restorePersonalSystemHandler,
	softDeletePersonalSystemHandler,
	updatePersonalSystemHandler,
} from "@/features/Systems/PersonalSystems/personalSystem.controller"

import { uploadMiddleware } from "@/middlewares/upload.middleware"
import FavoriteRouter from "@/routes/Systems/personalFavorite.route"
import { Router } from "express"

const router = Router()

// GET
router.get("/", getPersonalSystemsHandler)
router.get("/deleted", getDeletedPersonalSystemsHandler)
router.get("/:id", getPersonalSystemByIdHandler)

// POST
router.post("/", uploadMiddleware.single("image"), createPersonalSystemHandler)

// PATCH
router.patch("/:id", uploadMiddleware.single("image"), updatePersonalSystemHandler)
router.patch("/:id/restore", restorePersonalSystemHandler)

//DELETE
router.delete("/:id", softDeletePersonalSystemHandler)
router.delete("/:id/hard", hardDeletePersonalSystemHandler)
router.use("/favorites", FavoriteRouter)

export default router
