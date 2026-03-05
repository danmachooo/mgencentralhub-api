import { z } from "zod";

/**
 * Creates a superRefine check for uniqueness within an array of objects.
 * @param key - The property name that must be unique.
 * @param isCaseInsensitive - Whether to ignore capitalization (default: false).
 */

export const uniqueBy = <T extends Record<string, unknown>>(
  key: keyof T, 
  isCaseInsensitive = false
) => {
  return (items: T[], ctx: z.RefinementCtx): void => {
    const seen = new Set<unknown>();

    items.forEach((item, index) => {
      const value = item[key];
      let lookupValue: unknown = value;

      if (isCaseInsensitive && typeof value === "string") {
        lookupValue = value.toLowerCase();
      }

      if (seen.has(lookupValue)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [index, key as string],
          message: `Duplicate ${String(key)}: "${String(value)}" is already in use.`,
        });
      }

      seen.add(lookupValue);
    });
  };
};