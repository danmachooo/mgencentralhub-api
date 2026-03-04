import { createSystemSchema } from "@/schema/systems/create-system.schema"
import z from "zod"

export const createManySystemSchema = z.array(createSystemSchema).min(1)
