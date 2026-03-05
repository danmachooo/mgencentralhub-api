

import { z } from "zod"

export const entityBaseSchema = z.strictObject({
    name: z.string().min(1).max(10),
    description: z.string().min(5).max(50),
})