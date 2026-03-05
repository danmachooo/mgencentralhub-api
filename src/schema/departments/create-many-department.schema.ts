import { uniqueBy } from "@/helpers/shared/unique-by.helper"
import { CreateDepartmentInput } from "@/schema"
import { createDepartmentSchema } from "@/schema/departments/create-department.schema"
import { z } from "zod"

export const createManyDepartmentSchema = z.array(createDepartmentSchema).min(1).superRefine(uniqueBy<CreateDepartmentInput>("name"))
