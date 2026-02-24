import type { z } from "zod"

// Export here all Systems schema
export * from "@/schema/Systems/createSystem.schema"
export * from "@/schema/Systems/updateSystem.schema"
export * from "@/schema/Systems/systemQuery.schema"
export * from "@/schema/Systems/systemIdentifier.schema"
export * from "@/schema/Systems/creatorIdentifier.schema"

// Export here all Personal System Schema
export * from "@/schema/Systems/Personal/createPersonalSystem.schema"
export * from "@/schema/Systems/Personal/updatePersonalSystem.schema"
export * from "@/schema/Systems/Personal/personalSystemIdentifier.schema" //uncomment after defining
export * from "@/schema/Systems/Personal/personalSystemQuery.schema"

// Export here all System Flags schema
export * from "@/schema/Systems/SystemFlag/createSystemFlag.schema"
export * from "@/schema/Systems/SystemFlag/updateSystemFlag.schema"
export * from "@/schema/Systems/SystemFlag/systemFlagIdentifier.schema"

// Export here all Departments schema
export * from "@/schema/Departments/createDepartment.schema"
export * from "@/schema/Departments/createManyDepartment.schema"
export * from "@/schema/Departments/updateDepartment.schema"
export * from "@/schema/Departments/departmentQuery.schema"
export * from "@/schema/Departments/departmentIdentifier.schema"

// Export here all User schema
export * from "@/schema/User/userIdentifier.schema"
export * from "@/schema/User/createUserProfile.schema"
export * from "@/schema/User/userQuery.schema"

//Export here all Role Schema
export * from "@/schema/Role/createRole.schema"
export * from "@/schema/Role/createManyRole.schema"
export * from "@/schema/Role/updateRole.schema"
export * from "@/schema/Role/roleIdentifier.schema"

//Export here all Shared Schema
export * from "@/schema/shared/requestQuery.schema"

import type { createSystemSchema } from "@/schema/Systems/createSystem.schema"
import type { updateSystemSchema } from "@/schema/Systems/updateSystem.schema"
import type { systemQuerySchema } from "@/schema/Systems/systemQuery.schema"

import type { createDepartmentSchema } from "@/schema/Departments/createDepartment.schema"
import type { createManyDepartmentSchema } from "@/schema/Departments/createManyDepartment.schema"
import type { updateDepartmentSchema } from "@/schema/Departments/updateDepartment.schema"
import type { departmentQuerySchema } from "@/schema/Departments/departmentQuery.schema"

import type { createPersonalSystemSchema } from "@/schema/Systems/Personal/createPersonalSystem.schema"
import type { updatePersonalSystemSchema } from "@/schema/Systems/Personal/updatePersonalSystem.schema"
import type { personalSystemQuerySchema } from "@/schema/Systems/Personal/personalSystemQuery.schema"

import type { createUserProfileSchema } from "@/schema/User/createUserProfile.schema"
import type { userProfileQuerySchema } from "@/schema/User/userQuery.schema"

import type { createRoleSchema } from "@/schema/Role/createRole.schema"
import type { createManyRoleSchema } from "@/schema/Role/createManyRole.schema"
import type { updateRoleSchema } from "@/schema/Role/updateRole.schema"

import type { createSystemFlagSchema } from "@/schema/Systems/SystemFlag/createSystemFlag.schema"
import type { createManySystemFlagSchema } from "@/schema/Systems/SystemFlag/createManySystemFlag.schema"
import type { updateSystemFlagSchema } from "@/schema/Systems/SystemFlag/updateSystemFlag.schema"

// Identifiers schema
import type { creatorIdentifierSchema } from "@/schema/Systems/creatorIdentifier.schema"
import type { systemIdentifierSchema } from "@/schema/Systems/systemIdentifier.schema"
import type { personalSystemIdentifierSchema } from "@/schema/Systems/Personal/personalSystemIdentifier.schema"
import type { userIdentifierSchema } from "@/schema/User/userIdentifier.schema"
import type { departmentIdentifierSchema } from "@/schema/Departments/departmentIdentifier.schema"
import type { roleIdentifierSchema } from "@/schema/Role/roleIdentifier.schema"
import type { systemFlagIdentifierSchema } from "@/schema/Systems/SystemFlag/systemFlagIdentifier.schema"

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

//System Flag
export type CreateSystemFlagInput = z.infer<typeof createSystemFlagSchema>
export type CreateManySystemFlagInput = z.infer<typeof createManySystemFlagSchema>
export type UpdateSystemFlagInput = z.infer<typeof updateSystemFlagSchema>
export type SystemFlagIdentifier = z.infer<typeof systemFlagIdentifierSchema>

// Personal System
export type CreatePersonalSystemInput = z.infer<typeof createPersonalSystemSchema>
export type UpdatePersonalSystemInput = z.infer<typeof updatePersonalSystemSchema>
export type PersonalSystemQueryInput = z.infer<typeof personalSystemQuerySchema>
export type PersonalSystemIdentifier = z.infer<typeof personalSystemIdentifierSchema>

// Departments
export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>
export type CreateManyDepartmentInput = z.infer<typeof createManyDepartmentSchema>
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>
export type DepartmentQueryInput = z.infer<typeof departmentQuerySchema>

//User Profile
export type CreateUserProfileInput = z.infer<typeof createUserProfileSchema>
export type UserProfileQuery = z.infer<typeof userProfileQuerySchema>

//User Role
export type CreateRoleInput = z.infer<typeof createRoleSchema>
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>
export type RoleIdentifier = z.infer<typeof roleIdentifierSchema>
export type CreateManyRoleInput = z.infer<typeof createManyRoleSchema>
