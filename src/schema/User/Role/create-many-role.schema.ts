import { createRoleSchema } from "@/schema/User/Role/create-role.schema"
import z from "zod"

export const createManyRoleSchema = z.array(createRoleSchema).min(1)
