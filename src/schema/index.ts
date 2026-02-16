import { z } from "zod"

export * from "./Systems/createSystem.schema"
export * from "./Systems/updateSystem.schema"
export * from "./Systems/Personal/createPersonalSystem.schema"
export * from "./Systems/Personal/updatePersonalSystem.schema"
export * from "./Departments/createDepartment.schema"
export * from "./Departments/updateDepartment.schema"

import { createDepartmentSchema } from "./Departments/createDepartment.schema"
import { updateDepartmentSchema } from "./Departments/updateDepartment.schema"
import { createSystemSchema } from "./Systems/createSystem.schema"
import { createPersonalSystemSchema } from "./Systems/Personal/createPersonalSystem.schema"
import { updatePersonalSystemSchema } from "./Systems/Personal/updatePersonalSystem.schema"
import { updateSystemSchema } from "./Systems/updateSystem.schema"

//Infer schema to be a type

// General System
export type CreateSystemInput = z.infer<typeof createSystemSchema>
export type UpdateSystemInput = z.infer<typeof updateSystemSchema>

// Personal System
export type CreatePersonalSystemInput = z.infer<typeof createPersonalSystemSchema>
export type UpdatePersonalSystemInput = z.infer<typeof updatePersonalSystemSchema>

// Departments
export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>
