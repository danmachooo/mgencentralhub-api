import { getUsersHandler } from "@/features/Users/Profile/userProfile.controller"
import { Router } from "express"

const router = Router()

router.get("/", getUsersHandler)

export default router
