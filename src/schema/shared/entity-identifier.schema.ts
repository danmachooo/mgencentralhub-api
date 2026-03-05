

import { z } from "zod"

export const entityIdentifierSchema = z.strictObject({
    id: z.uuid().min(1)
})