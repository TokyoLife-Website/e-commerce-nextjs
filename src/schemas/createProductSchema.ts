import { Color } from "@/types/color";
import { DiscountType } from "@/types/discountType";
import { Size } from "@/types/size";
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
        color: z.nativeEnum(Color),
        size: z.nativeEnum(Size),
        quantity: z.number().min(0),
      })
    )
    .min(1, "At least one SKU is required"),
  images: z
    .array(z.instanceof(File))
    .max(5, "You can upload up to 5 images only")
    .min(1, "At least one image is required"),
});

export type CreateProductFormValues = z.infer<typeof createProductSchema>;
