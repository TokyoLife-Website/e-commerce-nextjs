import { z } from "zod";

export const emailSchema = z
  .string()
  .min(1, "Vui lòng nhập email của bạn")
  .email("Email không hợp lệ");
