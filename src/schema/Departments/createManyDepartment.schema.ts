import { createDepartmentSchema } from "@/schema/Departments/createDepartment.schema"
import { z } from "zod"

export const createManyDepartmentSchema = z.array(createDepartmentSchema).min(1)
