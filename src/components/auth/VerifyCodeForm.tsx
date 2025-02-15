import React, { useState } from "react";
import CustomButton from "../CustomBtn";
import { forgotPasswordSchema } from "@/schemas/forgotPasswordSchema";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useVerifyOTPMutation } from "@/hooks/api/auth.api";
import { handleRequestError } from "@/utils/errorHandler";
import useToast from "@/hooks/useToastify";
import OTPInput from "../OTPInput";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import { z } from "zod";
import { openModal } from "@/redux/modalSlice";
import { AuthModalType } from "@/types/authModal";

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"), // Validate đủ 6 ký tự
});

type OTPFormData = z.infer<typeof otpSchema>;

export const VerifyCodeForm = () => {
  // const [otp, setOtp] = useState("");
  const { showSuccess } = useToast();
  const dispatch = useAppDispatch();
  const { mutateAsync } = useVerifyOTPMutation();
  const { email } = useAppSelector((state: RootState) => state.auth);

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<OTPFormData>({
    defaultValues: { otp: "" },
    mode: "onChange",
    resolver: zodResolver(otpSchema),
  });

  const onSubmit: SubmitHandler<OTPFormData> = async (data) => {
    try {
      const { message } = await mutateAsync({ email, otp: data.otp });
      showSuccess(message);
      dispatch(openModal(AuthModalType.LOGIN));
    } catch (error) {
      handleRequestError(error);
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="overflow-y-auto  absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-16 bg-white"
    >
      <div className="font-extrabold text-center text-xl leading-6  mb-6 ">
        NHẬP MÃ XÁC MINH
      </div>
      <p className="font-medium text-left text-sm leading-[18px] mb-[15px]">
        Chúng tôi đã gửi mã xác minh OTP đến địa chỉ email: <b>{email}</b> của
        Quý Khách.
      </p>
      <p className="font-medium text-left text-sm leading-[18px] mb-[15px]">
        Vui lòng kiểm tra tin nhắn và nhập mã OTP 6 số để hoàn thành đăng ký.
      </p>
      <div className="mb-4 mt-10">
        <Controller
          name="otp"
          control={control}
          render={({ field }) => (
            <OTPInput
              value={field.value}
              onChange={(val) => setValue("otp", val)}
            />
          )}
        />
        {errors.otp && (
          <p className="text-red-500 mt-2">{errors.otp.message}</p>
        )}
        {/* <OTPInput length={6} onChange={setOtp} value={otp} /> */}
      </div>
      <div className="mb-10 text-center font-medium text-sm leading-[18px]">
        Còn lại 00:16
      </div>
      <CustomButton className="w-full text-white">Hoàn thành</CustomButton>
      <div className="mt-6 text-center font-medium text-xs leading-[18px]">
        Chưa nhận được mã OTP?{" "}
        <span className="text-primary cursor-pointer underline">Gửi lại</span>
      </div>
    </form>
  );
};
