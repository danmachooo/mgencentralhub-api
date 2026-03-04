import { createSystemSchema } from "@/schema/Systems/create-system.schema"
import z from "zod"

export const createManySystemSchema = z.array(createSystemSchema).min(1)
