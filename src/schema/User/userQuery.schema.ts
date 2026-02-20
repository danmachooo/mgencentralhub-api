import { createCollectionQuerySchema } from "@/schema/shared/requestQuery.schema";
import { UserRole } from "@prisma/client";
import { z } from "zod";

export const userProfileQuerySchema = createCollectionQuerySchema(
    {
        role: z.enum(UserRole).optional(),
    },
    ["createdAt", "role"]
)