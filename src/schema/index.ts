// import { systemQuerySchema } from './Systems/systemQuery.schema';
import type { z } from "zod"

export * from "@/schema/Systems/createSystem.schema"
export * from "@/schema/Systems/updateSystem.schema"
export * from "@/schema/Systems/Personal/createPersonalSystem.schema"
export * from "@/schema/Systems/Personal/updatePersonalSystem.schema"
export * from "@/schema/Departments/createDepartment.schema"
export * from "@/schema/Departments/updateDepartment.schema"
export * from "@/schema/User/userIdentifier.schema"
export * from "@/schema/User/createUserProfile.schema"
export * from "@/schema/shared/requestQuery.schema"
export * from "@/schema/Systems/systemQuery.schema"

import type { createDepartmentSchema } from "@/schema/Departments/createDepartment.schema"
import type { updateDepartmentSchema } from "@/schema/Departments/updateDepartment.schema"
import type { createSystemSchema } from "@/schema/Systems/createSystem.schema"
import type { createPersonalSystemSchema } from "@/schema/Systems/Personal/createPersonalSystem.schema"
import type { updatePersonalSystemSchema } from "@/schema/Systems/Personal/updatePersonalSystem.schema"
import type { updateSystemSchema } from "@/schema/Systems/updateSystem.schema"
import type { createUserProfileSchema } from "@/schema/User/createUserProfile.schema"
import type { systemQuerySchema } from "@/schema/Systems/systemQuery.schema"

// Identifiers schema
import type { creatorIdentifierSchema } from "@/schema/Systems/createSystem.schema"
import type { systemIdentifierSchema } from "@/schema/Systems/updateSystem.schema"
import type { userIdentifierSchema } from "@/schema/User/userIdentifier.schema"
import type { departmentIdentifierSchema } from "@/schema/Departments/departmentIdentifier.schema"

//Infer schema to be a type

// Identifiers type
export type CreatorIdentifier = z.infer<typeof creatorIdentifierSchema>
export type SystemIdentifier = z.infer<typeof systemIdentifierSchema>
export type UserIdentifier = z.infer<typeof userIdentifierSchema>
export type DepartmentIdentifier = z.infer<typeof departmentIdentifierSchema>

// General System
export type CreateSystemInput = z.infer<typeof createSystemSchema>
export type UpdateSystemInput = z.infer<typeof updateSystemSchema>
export type SystemQueryInput = z.infer<typeof systemQuerySchema>

// Personal System
export type CreatePersonalSystemInput = z.infer<typeof createPersonalSystemSchema>
export type UpdatePersonalSystemInput = z.infer<typeof updatePersonalSystemSchema>

// Departments
export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>

//User Profile
export type CreateUserProfileInput = z.infer<typeof createUserProfileSchema>
