import type { z } from "zod"

// Export here all Systems schema
export * from "@/schema/Systems/create-system.schema"
export * from "@/schema/Systems/update-system.schema"
export * from "@/schema/Systems/system-query.schema"
export * from "@/schema/Systems/system-identifier.schema"
export * from "@/schema/Systems/creator-identifier.schema"
export * from "@/schema/Systems/create-many-system.schema"

// Export here all Personal System Schema
export * from "@/schema/Systems/Personal/create-personal-system.schema"
export * from "@/schema/Systems/Personal/create-many-personal-system.schema"
export * from "@/schema/Systems/Personal/update-personal-system.schema"
export * from "@/schema/Systems/Personal/personal-system-identifier.schema" //uncomment after defining
export * from "@/schema/Systems/Personal/personal-system-query.schema"

// Export here all System Flags schema
export * from "@/schema/Systems/SystemFlag/create-system-flag.schema"
export * from "@/schema/Systems/SystemFlag/update-system-flag.schema"
export * from "@/schema/Systems/SystemFlag/system-flag-identifier.schema"

// Export here all Departments schema
export * from "@/schema/Departments/create-department.schema"
export * from "@/schema/Departments/create-many-department.schema"
export * from "@/schema/Departments/update-department.schema"
export * from "@/schema/Departments/department-query.schema"
export * from "@/schema/Departments/department-identifier.schema"

// Export here all User schema
export * from "@/schema/User/user-identifier.schema"
export * from "@/schema/User/Profile/create-user-profile.schema"
export * from "@/schema/User/user-query.schema"

//Export here all Role Schema
export * from "@/schema/User/Role/create-role.schema"
export * from "@/schema/User/Role/create-many-role.schema"
export * from "@/schema/User/Role/update-role.schema"
export * from "@/schema/User/Role/role-identifier.schema"

//Export here all Chatbot schema
export * from "@/schema/Chatbot/prompt.schema"

//Export here all Shared Schema
export * from "@/schema/shared/request-query.schema"

import type { createSystemSchema } from "@/schema/Systems/create-system.schema"
import type { createManySystemSchema } from "@/schema/Systems/create-many-system.schema"
import type { updateSystemSchema } from "@/schema/Systems/update-system.schema"
import type { systemQuerySchema } from "@/schema/Systems/system-query.schema"

import type { createDepartmentSchema } from "@/schema/Departments/create-department.schema"
import type { createManyDepartmentSchema } from "@/schema/Departments/create-many-department.schema"
import type { updateDepartmentSchema } from "@/schema/Departments/update-department.schema"
import type { departmentQuerySchema } from "@/schema/Departments/department-query.schema"

import type { createPersonalSystemSchema } from "@/schema/Systems/Personal/create-personal-system.schema"
import type { createManyPersonalSystemSchema } from "@/schema/Systems/Personal/create-many-personal-system.schema"
import type { updatePersonalSystemSchema } from "@/schema/Systems/Personal/update-personal-system.schema"
import type { personalSystemQuerySchema } from "@/schema/Systems/Personal/personal-system-query.schema"

import type { createUserProfileSchema } from "@/schema/User/Profile/create-user-profile.schema"
import type { userProfileQuerySchema } from "@/schema/User/user-query.schema"
import type { updateUserProfileSchema } from "@/schema/User/Profile/update-user-profile.schema"

import type { createRoleSchema } from "@/schema/User/Role/create-role.schema"
import type { createManyRoleSchema } from "@/schema/User/Role/create-many-role.schema"
import type { updateRoleSchema } from "@/schema/User/Role/update-role.schema"

import type { createSystemFlagSchema } from "@/schema/Systems/SystemFlag/create-system-flag.schema"
import type { createManySystemFlagSchema } from "@/schema/Systems/SystemFlag/create-many-system-flag.schema"
import type { updateSystemFlagSchema } from "@/schema/Systems/SystemFlag/update-system-flag.schema"

import type { promptSchema } from "@/schema/Chatbot/prompt.schema"

// Identifiers schema
import type { creatorIdentifierSchema } from "@/schema/Systems/creator-identifier.schema"
import type { systemIdentifierSchema } from "@/schema/Systems/system-identifier.schema"
import type { personalSystemIdentifierSchema } from "@/schema/Systems/Personal/personal-system-identifier.schema"
import type { userIdentifierSchema } from "@/schema/User/user-identifier.schema"
import type { departmentIdentifierSchema } from "@/schema/Departments/department-identifier.schema"
import type { roleIdentifierSchema } from "@/schema/User/Role/role-identifier.schema"
import type { systemFlagIdentifierSchema } from "@/schema/Systems/SystemFlag/system-flag-identifier.schema"

//Infer schema to be a type

// Identifiers type
export type CreatorIdentifier = z.infer<typeof creatorIdentifierSchema>
export type SystemIdentifier = z.infer<typeof systemIdentifierSchema>
export type UserIdentifier = z.infer<typeof userIdentifierSchema>
export type DepartmentIdentifier = z.infer<typeof departmentIdentifierSchema>

// General System
export type CreateSystemInput = z.infer<typeof createSystemSchema>
export type CreateManySystemInput = z.infer<typeof createManySystemSchema>
export type UpdateSystemInput = z.infer<typeof updateSystemSchema>
export type SystemQueryInput = z.infer<typeof systemQuerySchema>

//System Flag
export type CreateSystemFlagInput = z.infer<typeof createSystemFlagSchema>
export type CreateManySystemFlagInput = z.infer<typeof createManySystemFlagSchema>
export type UpdateSystemFlagInput = z.infer<typeof updateSystemFlagSchema>
export type SystemFlagIdentifier = z.infer<typeof systemFlagIdentifierSchema>

// Personal System
export type CreatePersonalSystemInput = z.infer<typeof createPersonalSystemSchema>
export type CreateManyPersonalSystemInput = z.infer<typeof createManyPersonalSystemSchema>
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
export type UpdateUserProfileInput = z.infer<typeof updateUserProfileSchema>

//User Role
export type CreateRoleInput = z.infer<typeof createRoleSchema>
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>
export type RoleIdentifier = z.infer<typeof roleIdentifierSchema>
export type CreateManyRoleInput = z.infer<typeof createManyRoleSchema>

//Chatbot
export type PromptInput = z.infer<typeof promptSchema>
