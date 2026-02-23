import { createRoleSchema } from "@/schema/Role/createRole.schema"
import z from "zod"

export const createManyRoleSchema = z.array(createRoleSchema).min(1)
