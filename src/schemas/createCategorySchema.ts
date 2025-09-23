import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(100, "Category name must not exceed 100 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100, "Slug must not exceed 100 characters"),
  description: z.string().optional(),
  level: z.coerce.number().min(1).max(3),
  parentId: z.coerce.number().nullable(),
});

export type CreateCategoryFormData = z.infer<typeof createCategorySchema>;
