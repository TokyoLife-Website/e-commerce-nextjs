"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import TextInput from "@/components/inputs/TextInput";
import { useLoginMutation } from "@/hooks/api/auth.api";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/userSlice";
import useToast from "@/hooks/useToastify";
import { Role } from "@/types/role";
import { loginSchema } from "@/schemas";

export type LoginFormData = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { mutateAsync } = useLoginMutation();
  const dispatch = useDispatch();
  const { showSuccess } = useToast();

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
      const { data, message } = await mutateAsync(values);
      if (data.role === Role.ADMIN) {
        dispatch(setUser(data));
        showSuccess(message);
        router.push("/admin");
      } else {
        toast.error("Bạn không có quyền truy cập vào trang này!");
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
