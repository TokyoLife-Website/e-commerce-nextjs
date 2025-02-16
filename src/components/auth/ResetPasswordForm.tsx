import React from "react";
import CustomButton from "../CustomBtn";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useResetPasswordMutation } from "@/hooks/api/auth.api";
import { handleRequestError } from "@/utils/errorHandler";
import useToast from "@/hooks/useToastify";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import { openModal } from "@/redux/modalSlice";
import { AuthModalType } from "@/types/authModal";
import {
  ResetPasswordFormData,
  resetPasswordSchema,
  defaultValues,
} from "@/schemas/resetPasswordSchema";
import TextInput from "../TextInput";

export const ResetPasswordForm = () => {
  const { showSuccess } = useToast();
  const dispatch = useAppDispatch();
  const { mutateAsync } = useResetPasswordMutation();
  const { email } = useAppSelector((state: RootState) => state.auth);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    defaultValues,
    mode: "onChange",
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit: SubmitHandler<ResetPasswordFormData> = async (data) => {
    try {
      const { message } = await mutateAsync({
        email,
        newPassword: data.newPassword,
      });
      showSuccess(message);
      dispatch(openModal(AuthModalType.LOGIN));
    } catch (error) {
      handleRequestError(error);
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-[582px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 py-16 px-24 bg-white"
    >
      <div className="font-extrabold text-center text-xl leading-6  mb-6 ">
        ĐẶT LẠI MẬT KHẨU
      </div>
      <p className="font-medium text-center text-sm leading-[18px] mb-[15px]">
        Vui lòng nhập mật khẩu mới
      </p>

      <div className="mb-4 mt-10">
        <div className="mb-[15px]">
          <TextInput
            name="newPassword"
            control={control}
            errMsg={errors.newPassword?.message}
            isError={!!errors.newPassword}
            isRequired
            size="small"
            type="password"
            placeHolder="Nhập mật khẩu"
          />
        </div>
        <div className="mb-[15px]">
          <TextInput
            name="confirmNewPassword"
            control={control}
            errMsg={errors.confirmNewPassword?.message}
            isError={!!errors.confirmNewPassword}
            isRequired
            size="small"
            type="password"
            placeHolder="Nhập lại mật khẩu"
          />
        </div>
        <CustomButton className="w-full text-white">Hoàn thành</CustomButton>
      </div>
    </form>
  );
};
