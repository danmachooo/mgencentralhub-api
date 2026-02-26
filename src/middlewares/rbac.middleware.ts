import { prisma } from "@/lib";
import { asyncHandler } from "@/middlewares/asyncHandler.middleware";
import { HttpContext } from "@/types/shared";


const rbacMiddleware = asyncHandler(async (http: HttpContext) => {

})