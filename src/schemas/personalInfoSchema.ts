import { z } from "zod";
import dayjs from "dayjs";
import { Gender } from "@/types/gender";
import { emailSchema } from "./emailSchema";

export const personalInfoSchema = z.object({
  firstName: z.string().min(1, "Tên không được để trống"),
  lastName: z.string().min(1, "Họ không được để trống"),
  dob: z
    .date({
      required_error: "Ngày sinh không được bỏ trống",
      invalid_type_error: "Ngày sinh không hợp lệ",
    })
    .default(dayjs().toDate())
    .refine(
      (date) => date <= new Date(),
      "Ngày sinh không được là ngày tương lai"
    ),
  gender: z
    .enum(Object.values(Gender) as [string, ...string[]])
    .default(Gender.MALE),
  phone: z
    .string()
    .regex(/^(\+84|0)[3|5|7|8|9][0-9]{8}$/, "Số điện thoại không hợp lệ"),
  email: emailSchema,
  avatar: z.string().url("Ảnh đại diện phải là một URL hợp lệ").optional(),
});

export type personalInfoFormData = z.infer<typeof personalInfoSchema>;
