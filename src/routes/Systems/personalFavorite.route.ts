import { Router } from "express"
import {
	getFavoritePersonalSystemsHandler,
	toggleFavoritePersonalSystemHandler,
	getFavoritePersonalSystemByIdHandler,
} from "@/features/Systems/PersonalSystems/personalSystem.controller"

const router = Router()

router.get("/", getFavoritePersonalSystemsHandler)

router.post("/:id", getFavoritePersonalSystemByIdHandler)

router.post("/:id/toggle-favorite", toggleFavoritePersonalSystemHandler)

export default router
