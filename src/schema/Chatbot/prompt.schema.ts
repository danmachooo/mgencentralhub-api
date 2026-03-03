import z from "zod";

export const promptSchema = z.object({
    message: z.string().min(1).max(100)
})