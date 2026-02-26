import { createRoleSchema } from "@/schema/User/Role/createRole.schema"
import z from "zod"

export const createManyRoleSchema = z.array(createRoleSchema).min(1)
