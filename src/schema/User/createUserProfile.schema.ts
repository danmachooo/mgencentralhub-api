import { z } from "zod";
import { UserRole } from "@prisma/client";

export const createUserProfileSchema = z.object({
    id: z.string().min(1),
    role: z.enum(UserRole).default("EMPLOYEE"),
    department: z.uuid().min(1)
})
