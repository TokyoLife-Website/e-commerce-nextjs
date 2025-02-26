import Link from "next/link";
import React from "react";
import CustomButton from "../CustomBtn";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerSchema } from "@/schemas/registerSchema";
import { SubmitHandler, useForm } from "react-hook-form";
import { Gender } from "@/types/gender";
import dayjs from "dayjs";
import { handleRequestError } from "@/utils/errorHandler";
import SelectInput from "../inputs/SelectInput";
import useToast from "@/hooks/useToastify";
import { useRegisterMutation } from "@/hooks/api/auth.api";
import TextInput from "../inputs/TextInput";
import DateInput from "../inputs/DateInput";

export type RegisterFormData = z.infer<typeof registerSchema>;

const defaultValues: RegisterFormData = {
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  firstName: "",
  lastName: "",
  dob: dayjs().toDate(),
  gender: Gender.MALE,
};

export const RegisterForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    defaultValues,
    mode: "onChange",
    resolver: zodResolver(registerSchema),
  });
  const { showSuccess } = useToast();
  const { mutateAsync } = useRegisterMutation();

  const onSubmit: SubmitHandler<RegisterFormData> = async (payload) => {
    try {
      const { message } = await mutateAsync(payload);
      showSuccess(message);
    } catch (error) {
      handleRequestError(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1 className="font-extrabold text-2xl mb-4">Đăng ký</h1>
      <p className="text-sm font-medium mb-6">
        Tạo tài khoản và khám phá tất cả các lợi ích dành riêng cho người dùng
        đã đăng ký của TokyoLife.
      </p>
      <div className="flex items-start gap-5 mb-[15px]">
        <TextInput
          name="lastName"
          control={control}
          errMsg={errors.lastName?.message}
          isError={!!errors.lastName}
          label="Họ"
          isRequired
          size="small"
          placeHolder="Nhập họ của bạn"
        />
        <TextInput
          name="firstName"
          control={control}
          errMsg={errors.firstName?.message}
          isError={!!errors.firstName}
          label="Tên"
          isRequired
          size="small"
          placeHolder="Nhập tên của bạn"
        />
      </div>
      <div className="mb-[15px]">
        <TextInput
          name="phone"
          control={control}
          errMsg={errors.phone?.message}
          isError={!!errors.phone}
          label="SĐT"
          isRequired
          size="small"
          type="tel"
          placeHolder="Vui lòng nhập SĐT"
        />
      </div>
      <div className="mb-[15px]">
        <SelectInput
          name="gender"
          label="Giới tính"
          isRequired
          size="small"
          control={control}
          isError={!!errors.gender}
          errMsg={errors.gender?.message}
          options={[
            { id: Gender.MALE, name: "Nam" },
            { id: Gender.FEMALE, name: "Nữ" },
            { id: Gender.OTHER, name: "Khác" },
          ]}
        />
      </div>
      <div className="mb-[15px]">
        <TextInput
          name="email"
          control={control}
          errMsg={errors.email?.message}
          isError={!!errors.email}
          label="Email"
          isRequired
          size="small"
          placeHolder="Nhập email của bạn"
        />
      </div>
      <div className="mb-[15px]">
        <DateInput
          name="dob"
          label="Ngày sinh"
          size="small"
          isRequired
          control={control}
          isError={!!errors.dob}
          errMsg={errors.dob?.message}
          disabledFuture
        />
      </div>
      <div className="mb-[15px]">
        <TextInput
          name="password"
          control={control}
          errMsg={errors.password?.message}
          isError={!!errors.password}
          label="Mật khẩu"
          isRequired
          size="small"
          type="password"
          placeHolder="Nhập mật khẩu"
        />
      </div>
      <div className="mb-[15px]">
        <TextInput
          name="confirmPassword"
          control={control}
          errMsg={errors.confirmPassword?.message}
          isError={!!errors.confirmPassword}
          label="Xác nhận mật khẩu"
          isRequired
          size="small"
          type="password"
          placeHolder="Nhập lại mật khẩu xác nhậns"
        />
      </div>
      <p className="font-medium text-xs leading-4">
        Bằng cách tạo tài khoản, Quý Khách đã đồng ý với{" "}
        <Link
          className="text-[#007aff]"
          href={"https://tokyolife.vn/page/terms-conditions"}
        >
          Điều khoản & Điều kiện
        </Link>{" "}
        và{" "}
        <Link
          className="text-[#007aff]"
          href={"https://tokyolife.vn/page/privacy-policy"}
        >
          Chính sách Bảo mật
        </Link>{" "}
        của chúng tôi.
      </p>
      <CustomButton className="text-white w-full my-10 whitespace-nowrap">
        Đăng ký
      </CustomButton>
    </form>
  );
};
