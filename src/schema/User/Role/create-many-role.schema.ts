import { createRoleSchema } from "@/schema/User/role/create-role.schema"
import z from "zod"

export const createManyRoleSchema = z.array(createRoleSchema).min(1)
