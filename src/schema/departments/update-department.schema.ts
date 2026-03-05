import { createDepartmentSchema } from "@/schema/departments/create-department.schema";

export const updateDepartmentSchema = createDepartmentSchema.partial()