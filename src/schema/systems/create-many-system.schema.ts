import { uniqueBy } from "@/helpers/shared/unique-by.helper"
import { CreateSystemInput } from "@/schema"
import { createSystemSchema } from "@/schema/systems/create-system.schema"
import z from "zod"

export const createManySystemSchema = z.array(createSystemSchema).min(1).superRefine(uniqueBy<CreateSystemInput>("name", true))
