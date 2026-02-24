import { getFavoriteCompanySystemsHandler } from "@/features/Systems/system.controller"
import { Router } from "express"

const router = Router()

router.get("/", getFavoriteCompanySystemsHandler)

export default router
