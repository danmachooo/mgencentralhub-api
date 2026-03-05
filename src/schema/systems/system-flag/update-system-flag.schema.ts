import { createSystemFlagSchema } from "@/schema/systems/system-flag/create-system-flag.schema"
import { z } from "zod"

export const updateSystemFlagSchema = createSystemFlagSchema.partial()
