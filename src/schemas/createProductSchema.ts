import { Color } from "@/types/color";
import { DiscountType } from "@/types/discountType";
import { Size } from "@/types/size";
import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().gt(0, "Price must be greater than 0"),
  categoryLevel1Id: z.number().default(0),
  categoryLevel2Id: z.number().default(0),
  discountValue: z
    .number()
    .gt(0, "Discount value must be greater than 0")
    .nullable(),
  discountType: z
    .nativeEnum(DiscountType)
    .optional()
    .default(DiscountType.NONE),
  isActive: z.boolean(),
  categoryId: z.number().optional(),
  skus: z
    .array(
      z.object({
        id: z.number().optional(),
        sku: z.string().optional(),
        color: z.nativeEnum(Color),
        size: z.nativeEnum(Size),
        quantity: z.number().min(0),
      })
    )
    .min(1, "At least one SKU is required"),
  images: z
    .array(z.instanceof(File).or(z.string()))
    .max(5, "You can upload up to 5 images only")
    .min(1, "At least one image is required"),
});

export type CreateProductFormValues = z.infer<typeof createProductSchema>;
