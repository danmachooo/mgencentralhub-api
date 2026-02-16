import { createCompanySystemHandler, updateCompanySystemHandler } from "@/features/Systems/controllers/system.controller";
import { Router } from "express";

const router = Router()

router.post('/', createCompanySystemHandler)
router.patch('/:id', updateCompanySystemHandler)

export default router