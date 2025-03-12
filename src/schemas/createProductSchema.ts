import { DiscountType } from "@/types/discountType";
import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  slug: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be a positive number"),
  discountValue: z.number().min(0, "Discount value must be a positive number"),
  discountType: z
    .nativeEnum(DiscountType)
    .optional()
    .default(DiscountType.NONE),
  isActive: z.boolean(),
  categoryId: z.number().default(0),
  skus: z
    .array(
      z.object({
        color: z.number().min(0),
        size: z.number().min(0),
        quantity: z.number().min(0),
      })
    )
    .min(1, "At least one SKU is required"),
});

export type CreateProductFormValues = z.infer<typeof createProductSchema>;
