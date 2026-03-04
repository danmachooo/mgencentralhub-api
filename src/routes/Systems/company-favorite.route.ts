import {
	getFavoriteCompanySystemsHandler,
	toggleFavoriteSystemHandler,
	getFavoriteCompanySystemByIdHandler,
} from "@/features/systems/system.controller"
import { Router } from "express"

const router = Router()

router.get("/", getFavoriteCompanySystemsHandler)
router.get("/:id", getFavoriteCompanySystemByIdHandler)
router.post("/:id/toggle-favorite", toggleFavoriteSystemHandler)

export default router
