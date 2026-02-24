import { createCollectionQuerySchema } from "@/schema/shared/requestQuery.schema"

export const personalSystemQuerySchema = createCollectionQuerySchema({}, ["createdAt", "name"])
