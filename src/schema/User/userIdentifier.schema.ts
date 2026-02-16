import { z } from "zod";

export const userIdentifierSchema = z.object({
    id: z.uuid().min(1)
})