import { getOnboardStatusController, setOnboardStatusController } from "@/features/users/onboard/onboard.controller";
import { Router } from "express";

const router = Router();

router.get("/get", getOnboardStatusController)
router.patch("/set", setOnboardStatusController)


export default router
