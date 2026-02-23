import { createSystemFlagSchema } from "@/schema/Systems/SystemFlag/createSystemFlag.schema"
import { z } from "zod"

export const createManySystemFlagSchema = z.array(createSystemFlagSchema).min(1)
