import { createCollectionQuerySchema } from "@/schema/shared/request-query.schema"

export const personalSystemQuerySchema = createCollectionQuerySchema({}, ["createdAt", "name"])
