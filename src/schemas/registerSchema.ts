import { z } from "zod";
import { emailSchema } from "./emailSchema";
import dayjs from "dayjs";
import { Gender } from "@/types/gender";
import { passwordSchema } from "./passwordSchema";

export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
    firstName: z.string().min(1, "Vui lòng nhập tên của bạn"),
    lastName: z.string().min(1, "Vui lòng nhập họ của bạn"),
    phone: z
      .string()
      .regex(/^(\+84|0)[3|5|7|8|9][0-9]{8}$/, "Số điện thoại không hợp lệ"),
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
    gender: z.string().default(Gender.MALE),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });
