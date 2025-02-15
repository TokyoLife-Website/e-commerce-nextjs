import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, "Mật khẩu tối thiểu 8 ký tự")
  .max(32, "Mật khẩu không được vượt quá 32 ký tự")
  .regex(/[a-z]/, "Mật khẩu phải chứa ít nhất một chữ cái viết thường")
  .regex(/[A-Z]/, "Mật khẩu phải chứa ít nhất một chữ cái viết hoa")
  .regex(/[0-9]/, "Mật khẩu phải chứa ít nhất một số")
  .regex(/[@$!%*?&#]/, "Mật khẩu phải chứa ít nhất một ký tự đặc biệt")
  .refine((s) => !s.includes(" "), "Mật khẩu không được chứa dấu cách");
