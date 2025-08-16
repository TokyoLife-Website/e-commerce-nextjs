"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import TextInput from "@/components/inputs/TextInput";
import CheckboxInput from "@/components/inputs/CheckboxInput";

const loginSchema = z.object({
  email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ"),
  password: z
    .string()
    .min(1, "Mật khẩu là bắt buộc")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormData) => {
    setLoading(true);
    try {
      // TODO: Implement actual login API call here
      // const response = await loginAdmin(values);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo purposes, check if email contains "admin"
      if (values.email.includes("admin")) {
        toast.success("Đăng nhập thành công!");
        // Store admin token/session here
        localStorage.setItem("adminToken", "demo-token");
        localStorage.setItem(
          "adminUser",
          JSON.stringify({
            email: values.email,
            role: "admin",
          })
        );

        // Redirect to admin dashboard
        router.push("/admin");
      } else {
        toast.error("Email hoặc mật khẩu không đúng!");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi đăng nhập!");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Login Form */}
        <div className="bg-white shadow-xl rounded-2xl p-8 border-0">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <TextInput
              name="email"
              control={control}
              label="Email"
              isRequired={true}
              placeHolder="admin@example.com"
              isError={!!errors.email}
              errMsg={errors.email?.message}
            />

            <TextInput
              name="password"
              control={control}
              label="Mật khẩu"
              type="password"
              isRequired={true}
              placeHolder="Nhập mật khẩu"
              isError={!!errors.password}
              errMsg={errors.password?.message}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Đang đăng nhập...
                </div>
              ) : (
                "Đăng nhập"
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 font-medium mb-2">
              💡 Thông tin demo:
            </p>
            <p className="text-xs text-blue-700">Email: admin@example.com</p>
            <p className="text-xs text-blue-700">Password: 123456</p>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              © 2024 E-Commerce Admin Panel. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
