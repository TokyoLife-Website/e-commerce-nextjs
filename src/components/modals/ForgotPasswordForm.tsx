import React from "react";
import CustomButton from "../CustomBtn";
import {
  ForgotPasswordFormData,
  forgotPasswordSchema,
} from "@/schemas/forgotPasswordSchema";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForgotPasswordMutation } from "@/hooks/api/auth.api";
import { handleRequestError } from "@/utils/errorHandler";
import useToast from "@/hooks/useToastify";
import { useAppDispatch } from "@/redux/store";
import { setEmail } from "@/redux/authSlice";
import { openModal } from "@/redux/modalSlice";
import { ModalType } from "@/types/modal";
import TextInput from "../inputs/TextInput";

const defaultValues = {
  email: "",
};

export const ForgotPasswordForm = () => {
  const { showSuccess } = useToast();
  const { mutateAsync } = useForgotPasswordMutation();
  const dispatch = useAppDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    defaultValues,
    mode: "onChange",
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit: SubmitHandler<ForgotPasswordFormData> = async (data) => {
    try {
      const { message } = await mutateAsync(data);
      showSuccess(message);
      dispatch(setEmail(data));
      dispatch(openModal({ type: ModalType.VERIFY_CODE }));
    } catch (error) {
      handleRequestError(error);
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-[582px] overflow-y-auto text-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-24 pt-16 pb-20 bg-white"
    >
      <div className="font-extrabold text-xl leading-6  mb-6 ">
        QUÊN MẬT KHẨU?
      </div>
      <p className="font-medium text-sm leading-[18px] mb-6">
        Vui lòng nhập số điện thoại của Quý Khách để đặt lại mật khẩu.
      </p>
      <div className="mb-4">
        <TextInput
          name="email"
          control={control}
          isRequired
          size="small"
          placeHolder="Nhập email của bạn"
          errMsg={errors.email?.message}
          isError={!!errors.email}
        />
      </div>
      <CustomButton className="w-full text-white">GỬI</CustomButton>
    </form>
  );
};
