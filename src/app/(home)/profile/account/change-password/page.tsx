"use client";
import CustomButton from "@/components/layouts/CustomBtn";
import TextInput from "@/components/inputs/TextInput";
import { useUpdatePasswordMutation } from "@/hooks/api/user.api";
import useToast from "@/hooks/useToastify";
import {
  ChangePasswordFormData,
  changePasswordSchema,
} from "@/schemas/changePasswordSchema";
import { handleRequestError } from "@/utils/errorHandler";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

const defaultValues = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

export default function ChangePassword() {
  const { showSuccess } = useToast();
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    defaultValues,
    mode: "onChange",
    resolver: zodResolver(changePasswordSchema),
  });

  const { mutateAsync } = useUpdatePasswordMutation();
  const onSubmit: SubmitHandler<ChangePasswordFormData> = async (payload) => {
    try {
      const { message } = await mutateAsync(payload);
      showSuccess(message);
      reset(defaultValues);
    } catch (error) {
      handleRequestError(error);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-5">
      <div className="uppercase font-extrabold leading-6 text-xl mb-7">
        Đổi mật khẩu
      </div>
      <TextInput
        name="currentPassword"
        control={control}
        label="Mật khẩu"
        placeHolder="Nhập mật khẩu"
        type="password"
        size="small"
        isRequired
        errMsg={errors.currentPassword?.message}
        isError={!!errors.currentPassword}
      />
      <TextInput
        name="newPassword"
        control={control}
        label="Mật khẩu mới"
        placeHolder="Nhập mật khẩu mới"
        type="password"
        size="small"
        isRequired
        errMsg={errors.newPassword?.message}
        isError={!!errors.newPassword}
      />
      <TextInput
        name="confirmNewPassword"
        control={control}
        label="Xác nhận mật khẩu"
        placeHolder="Nhập lại mật khẩu xác nhận"
        type="password"
        size="small"
        isRequired
        errMsg={errors.confirmNewPassword?.message}
        isError={!!errors.confirmNewPassword}
      />
      <CustomButton className="text-white">Cập nhật</CustomButton>
    </form>
  );
}
