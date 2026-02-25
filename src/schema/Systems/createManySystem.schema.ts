import { createSystemSchema } from "@/schema/Systems/createSystem.schema"
import z from "zod"

export const createManySystemSchema = z.array(createSystemSchema).min(1)
