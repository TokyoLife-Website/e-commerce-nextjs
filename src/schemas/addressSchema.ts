import { z } from "zod";
import { emailSchema } from "./emailSchema";
import { AddressType } from "@/types/address";

export const addressSchema = z.object({
  fullName: z.string().min(1, "Vui lòng nhập tên của bạn"),
  phone: z
    .string()
    .regex(/^(\+84|0)[3|5|7|8|9][0-9]{8}$/, "Số điện thoại không hợp lệ"),
  email: emailSchema,
  detail: z.string().min(1, "Vui lòng nhập địa chỉ"),
  provinceId: z.number().min(1, "Tỉnh/Thành phố không được để trống"),
  districtId: z.number().min(1, "Quận/Huyện không được để trống"),
  wardId: z.number().min(1, "Phường/Xã không được để trống"),
  isDefault: z.boolean(),
  type: z
    .enum(Object.values(AddressType) as [string, ...string[]])
    .default(AddressType.HOME),
});

export type AddressFormData = z.infer<typeof addressSchema>;
