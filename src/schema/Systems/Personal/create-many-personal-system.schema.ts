import z from "zod"
import { createPersonalSystemSchema } from "@/schema"

export const createManyPersonalSystemSchema = z.array(createPersonalSystemSchema).min(1)
