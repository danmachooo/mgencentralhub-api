import {
	getFavoriteCompanySystemsHandler,
	toggleFavoriteSystemHandler,
	getFavoriteCompanySystemByIdHandler,
} from "@/features/Systems/system.controller"
import { Router } from "express"

const router = Router()

router.get("/", getFavoriteCompanySystemsHandler)
router.get("/:id", getFavoriteCompanySystemByIdHandler)
router.post("/:id/toggle-favorite", toggleFavoriteSystemHandler)

export default router
