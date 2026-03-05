import type { z } from "zod"

// Export here all Systems schema
export * from "@/schema/systems/create-system.schema"
export * from "@/schema/systems/update-system.schema"
export * from "@/schema/systems/system-query.schema"
export * from "@/schema/systems/system-identifier.schema"
export * from "@/schema/systems/creator-identifier.schema"
export * from "@/schema/systems/create-many-system.schema"

// Export here all Personal System Schema
export * from "@/schema/systems/personal/create-personal-system.schema"
export * from "@/schema/systems/personal/create-many-personal-system.schema"
export * from "@/schema/systems/personal/update-personal-system.schema"
export * from "@/schema/systems/personal/personal-system-identifier.schema" 
export * from "@/schema/systems/personal/personal-system-query.schema"

// Export here all System Flags schema
export * from "@/schema/systems/system-flag/create-system-flag.schema"
export * from "@/schema/systems/system-flag/update-system-flag.schema"
export * from "@/schema/systems/system-flag/system-flag-identifier.schema"

// Export here all Departments schema
export * from "@/schema/departments/create-department.schema"
export * from "@/schema/departments/create-many-department.schema"
export * from "@/schema/departments/update-department.schema"
export * from "@/schema/departments/department-query.schema"
export * from "@/schema/departments/department-identifier.schema"

// Export here all User schema
export * from "@/schema/users/user-identifier.schema"
export * from "@/schema/users/profile/create-user-profile.schema"
export * from "@/schema/users/user-query.schema"

//Export here all Role Schema
export * from "@/schema/users/role/create-role.schema"
export * from "@/schema/users/role/create-many-role.schema"
export * from "@/schema/users/role/update-role.schema"
export * from "@/schema/users/role/role-identifier.schema"

//Export here all Chatbot schema
export * from "@/schema/chatbot/prompt.schema"

//Export here all Shared Schema
export * from "@/schema/shared/request-query.schema"

import type { createSystemSchema } from "@/schema/systems/create-system.schema"
import type { createManySystemSchema } from "@/schema/systems/create-many-system.schema"
import type { updateSystemSchema } from "@/schema/systems/update-system.schema"
import type { systemQuerySchema } from "@/schema/systems/system-query.schema"

import type { createDepartmentSchema } from "@/schema/departments/create-department.schema"
import type { createManyDepartmentSchema } from "@/schema/departments/create-many-department.schema"
import type { updateDepartmentSchema } from "@/schema/departments/update-department.schema"
import type { departmentQuerySchema } from "@/schema/departments/department-query.schema"

import type { createPersonalSystemSchema } from "@/schema/systems/personal/create-personal-system.schema"
import type { createManyPersonalSystemSchema } from "@/schema/systems/personal/create-many-personal-system.schema"
import type { updatePersonalSystemSchema } from "@/schema/systems/personal/update-personal-system.schema"
import type { personalSystemQuerySchema } from "@/schema/systems/personal/personal-system-query.schema"

import type { createUserProfileSchema } from "@/schema/users/profile/create-user-profile.schema"
import type { userProfileQuerySchema } from "@/schema/users/user-query.schema"
import type { updateUserProfileSchema } from "@/schema/users/profile/update-user-profile.schema"

import type { createRoleSchema } from "@/schema/users/role/create-role.schema"
import type { createManyRoleSchema } from "@/schema/users/role/create-many-role.schema"
import type { updateRoleSchema } from "@/schema/users/role/update-role.schema"

import type { createSystemFlagSchema } from "@/schema/systems/system-flag/create-system-flag.schema"
import type { createManySystemFlagSchema } from "@/schema/systems/system-flag/create-many-system-flag.schema"
import type { updateSystemFlagSchema } from "@/schema/systems/system-flag/update-system-flag.schema"

import type { promptSchema } from "@/schema/chatbot/prompt.schema"

// Identifiers schema
import type { creatorIdentifierSchema } from "@/schema/systems/creator-identifier.schema"
import type { systemIdentifierSchema } from "@/schema/systems/system-identifier.schema"
import type { personalSystemIdentifierSchema } from "@/schema/systems/personal/personal-system-identifier.schema"
import type { systemFlagIdentifierSchema } from "@/schema/systems/system-flag/system-flag-identifier.schema"
import type { departmentIdentifierSchema } from "@/schema/departments/department-identifier.schema"
import type { userIdentifierSchema } from "@/schema/users/user-identifier.schema"
import type { roleIdentifierSchema } from "@/schema/users/role/role-identifier.schema"

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
