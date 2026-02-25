import {
	createCompanySystemHandler,
	getCompanySystemByIdHandler,
	getCompanySystemsHandler,
	hardDeleteCompanySystemHandler,
	restoreCompanySystemHandler,
	softDeleteCompanySystemHandler,
	toggleFavoriteSystemHandler,
	updateCompanySystemHandler,
} from "@/features/Systems/system.controller"
import { getDeletedCompanySystems } from "@/features/Systems/system.service"
import FavoriteRouter from "@/routes/Systems/companyFavorite.route"
import PersonalSystemRouter from "@/routes/Systems/personal.route"
import { Router } from "express"

const router = Router()

// GET
router.get("/", getCompanySystemsHandler)
router.get("/deleted", getDeletedCompanySystems)
router.get("/:id", getCompanySystemByIdHandler)

// POST
router.post("/", createCompanySystemHandler)

// PATCH
router.patch("/:id", updateCompanySystemHandler)
router.patch("/:id/restore", restoreCompanySystemHandler)

//DELETE
router.delete("/:id", softDeleteCompanySystemHandler)
router.delete("/:id/hard", hardDeleteCompanySystemHandler)

router.use("/personal", PersonalSystemRouter)
router.use("/favorites", FavoriteRouter)

export default router
