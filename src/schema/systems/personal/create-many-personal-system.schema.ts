import z from "zod"
import { CreateManyPersonalSystemInput, CreatePersonalSystemInput, createPersonalSystemSchema } from "@/schema"
import { uniqueBy } from "@/helpers/shared/unique-by.helper"

export const createManyPersonalSystemSchema = z.array(createPersonalSystemSchema).min(1).superRefine(uniqueBy<CreatePersonalSystemInput>("name", true))
