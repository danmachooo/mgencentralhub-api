import { uniqueBy } from "@/helpers/shared/unique-by.helper"
import { CreateRoleInput } from "@/schema"
import { createRoleSchema } from "@/schema/users/role/create-role.schema"
import { z }from "zod"

export const createManyRoleSchema = z.array(createRoleSchema).min(1).superRefine(uniqueBy<CreateRoleInput>("name"))
