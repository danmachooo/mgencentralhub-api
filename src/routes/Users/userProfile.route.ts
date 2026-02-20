import { getUsersHandler } from "@/features/UserProfiles/userProfile.controller"
import { Router } from "express"

const router = Router()

router.get("/", getUsersHandler)

export default router
