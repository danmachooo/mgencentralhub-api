import { createUserProfileSchema } from "@/schema/users/profile/create-user-profile.schema"

export const updateUserProfileSchema = createUserProfileSchema.partial()