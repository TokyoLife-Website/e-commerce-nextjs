import React, { useState } from "react";
import CustomButton from "../CustomBtn";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForgotPasswordMutation,
  useVerifyOTPMutation,
} from "@/hooks/api/auth.api";
import { handleRequestError } from "@/utils/errorHandler";
import useToast from "@/hooks/useToastify";
import OTPInput from "../../inputs/OTPInput";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import { z } from "zod";
import { openModal } from "@/redux/modalSlice";
import { ModalType } from "@/types/modal";
import Countdown from "../CountDown";

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type OTPFormData = z.infer<typeof otpSchema>;

export const VerifyCodeForm = () => {
  const { showSuccess } = useToast();
  const dispatch = useAppDispatch();
  const { mutateAsync: verifyOTP } = useVerifyOTPMutation();
  const { mutateAsync: resendOTP } = useForgotPasswordMutation();
  const { email } = useAppSelector((state: RootState) => state.user);
  const [canResend, setCanResend] = useState(false);
  const [countdownKey, setCountdownKey] = useState(0);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OTPFormData>({
    defaultValues: { otp: "" },
    mode: "onChange",
    resolver: zodResolver(otpSchema),
  });

  const onSubmit: SubmitHandler<OTPFormData> = async (data) => {
    try {
      const { message } = await verifyOTP({ email, otp: data.otp });
      showSuccess(message);
      dispatch(openModal({ type: ModalType.RESET_PASSWORD }));
    } catch (error) {
      handleRequestError(error);
    }
  };

  const handleResendOTP = async () => {
    if (canResend) {
      await resendOTP({ email: email });
      showSuccess("Mã OTP mới đã được gửi!");
      setCanResend(false);
      setCountdownKey((prev) => prev + 1);
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
              length={6}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        {errors.otp && (
          <p className="text-center text-red-500 mt-2">{errors.otp.message}</p>
        )}
      </div>
      <div className="mb-10 text-center font-medium text-sm leading-[18px]">
        Còn lại{" "}
        <Countdown
          key={countdownKey}
          initialTime={60}
          onComplete={() => setCanResend(true)}
        />
      </div>

      <CustomButton type="submit" className="w-full text-white">
        Hoàn thành
      </CustomButton>
      {canResend && (
        <div className="mt-6 text-center font-medium text-xs leading-[18px]">
          Chưa nhận được mã OTP?{" "}
          <span
            onClick={handleResendOTP}
            className="text-primary cursor-pointer underline"
          >
            Gửi lại
          </span>
        </div>
      )}
    </form>
  );
};
