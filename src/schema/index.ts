import { z } from "zod"

export * from "./Systems/createSystem.schema"
export * from "./Systems/updateSystem.schema"
export * from "./Systems/Personal/createPersonalSystem.schema"
export * from "./Systems/Personal/updatePersonalSystem.schema"
export * from "./Departments/createDepartment.schema"
export * from "./Departments/updateDepartment.schema"
export * from "./User/userIdentifier.schema"

import { createDepartmentSchema } from "./Departments/createDepartment.schema"
import { updateDepartmentSchema } from "./Departments/updateDepartment.schema"
import { createSystemSchema } from "./Systems/createSystem.schema"
import { createPersonalSystemSchema } from "./Systems/Personal/createPersonalSystem.schema"
import { updatePersonalSystemSchema } from "./Systems/Personal/updatePersonalSystem.schema"
import { updateSystemSchema } from "./Systems/updateSystem.schema"

// Identifiers schema
import { creatorIdentifierSchema } from "./Systems/createSystem.schema"
import { systemIdentifierSchema } from "./Systems/updateSystem.schema"
import { userIdentifierSchema } from "./User/userIdentifier.schema"

//Infer schema to be a type

// Identifiers type
export type CreatorIdentifier = z.infer<typeof creatorIdentifierSchema>
export type SystemIdentifier = z.infer<typeof systemIdentifierSchema>
export type UserIdentifier = z.infer<typeof userIdentifierSchema>

// General System
export type CreateSystemInput = z.infer<typeof createSystemSchema>
export type UpdateSystemInput = z.infer<typeof updateSystemSchema>

// Personal System
export type CreatePersonalSystemInput = z.infer<typeof createPersonalSystemSchema>
export type UpdatePersonalSystemInput = z.infer<typeof updatePersonalSystemSchema>

// Departments
export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>
