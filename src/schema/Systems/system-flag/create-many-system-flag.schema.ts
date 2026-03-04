import { createSystemFlagSchema } from "@/schema/Systems/system-flag/create-system-flag.schema"
import { z } from "zod"

export const createManySystemFlagSchema = z.array(createSystemFlagSchema).min(1)
