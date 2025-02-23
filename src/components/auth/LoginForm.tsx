import React from "react";
import { jwtDecode } from "jwt-decode";
import CustomButton from "../CustomBtn";
import TextInput from "../TextInput";
import { z } from "zod";
import { loginSchema } from "@/schemas";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useToast from "@/hooks/useToastify";
import { useLoginMutation } from "@/hooks/api/auth.api";
import { handleRequestError } from "@/utils/errorHandler";
import { useAppDispatch } from "@/redux/store";
import { login } from "@/redux/authSlice";
import { closeModal, openModal } from "@/redux/modalSlice";
import { ModalType } from "@/types/modal";

export type LoginFormData = z.infer<typeof loginSchema>;

const defaultValues = {
  email: "",
  password: "",
};

export const LoginForm = () => {
  const { showSuccess } = useToast();
  const { mutateAsync } = useLoginMutation();
  const dispatch = useAppDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues,
    mode: "onSubmit",
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormData> = async (payload) => {
    try {
      const {
        data: { access_token, refresh_token },
        message,
      } = await mutateAsync(payload);
      const decoded = jwtDecode<{ id: string | number }>(access_token);
      dispatch(
        login({
          accessToken: access_token,
          refreshToken: refresh_token,
          userId: decoded.id,
        })
      );
      showSuccess(message);
      dispatch(closeModal());
    } catch (error) {
      handleRequestError(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1 className="font-extrabold text-2xl mb-4">Đăng nhập</h1>
      <p className="text-sm font-medium mb-6">
        Nhập số điện thoại của Quý Khách để đăng nhập tài khoản TokyoLife.
      </p>
      <div className="mb-[15px]">
        <TextInput
          name="email"
          control={control}
          label="Email"
          isRequired
          size="small"
          placeHolder="Vui lòng nhập email"
          errMsg={errors.email?.message}
          isError={!!errors.email}
        />
      </div>
      <div className="mb-[15px]">
        <TextInput
          name="password"
          control={control}
          label="Mật khẩu"
          isRequired
          size="small"
          type="password"
          placeHolder="Nhập mật khẩu"
          errMsg={errors.password?.message}
          isError={!!errors.password}
        />
      </div>
      <p
        onClick={() => dispatch(openModal(ModalType.FORGOT_PASSWORD))}
        className="underline text-xs leading-4 cursor-pointer my-3 float-right"
      >
        Quên mật khẩu?
      </p>
      <CustomButton className="w-full text-white mt-10">Đăng nhập</CustomButton>
    </form>
  );
};
