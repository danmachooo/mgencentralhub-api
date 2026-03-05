import { uniqueBy } from "@/helpers/shared/unique-by.helper"
import { CreateSystemFlagInput } from "@/schema"
import { createSystemFlagSchema } from "@/schema/systems/system-flag/create-system-flag.schema"
import { z } from "zod"

export const createManySystemFlagSchema = z.array(createSystemFlagSchema).min(1).superRefine(uniqueBy<CreateSystemFlagInput>("name", true))
