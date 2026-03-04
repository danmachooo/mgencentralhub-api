import { createDepartmentSchema } from "@/schema/departments/create-department.schema"
import { z } from "zod"

export const createManyDepartmentSchema = z.array(createDepartmentSchema).min(1)
