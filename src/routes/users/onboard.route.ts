import { getOnboardStatusController, setOnboardStatusController } from "@/features/users/onboard/onboard.controller";
import { requireRole } from "@/middlewares";
import { Router } from "express";


const router = Router();

router.use(requireRole("ADMIN", "EMPLOYEE"));

router.get("/get", getOnboardStatusController)
router.patch("/set", setOnboardStatusController)


export default router
